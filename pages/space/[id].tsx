import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPage, GetServerSideProps } from "next";
import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import moment from "moment";

import UserContext from "context/User";
import { useSpace } from "hooks/useSpace";
import { tokenPOST } from "client/token";
import { fetchSpace } from "pages/api/spaces/[id]";

import Stage from "components/Stage";
import UserInteractionPrompt from "components/UserInteractionPrompt";

import starfield from "../../public/starfield-bg.jpg";
import { TEMPORARY_SPACE_PASSTHROUGH } from "lib/constants";

const BackgroundImageWrap = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: 0;
`;

interface Props {
  heliosURL: string;
  spaceBackendURL: string;
  title: string;
  endsAt?: number;
}

const SpacePage: NextPage<Props> = ({
  heliosURL,
  spaceBackendURL,
  title,
  endsAt,
}: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { isReady: isRouterReady } = router;
  const user = React.useContext(UserContext);
  const { joinSpace, leaveSpace } = useSpace();
  const [canJoinSpace, setCanJoinSpace] = useState(true);
  const participantNameRef = useRef<string>("");

  useEffect(() => {
    setCanJoinSpace((endsAt && moment(endsAt).diff(moment()) > 0) || !endsAt);
  }, [endsAt]);

  useEffect(() => {
    if (spaceBackendURL) {
      (window as any).MUX_SPACES_BACKEND_URL = spaceBackendURL;
    }
    if (heliosURL) {
      (window as any).MUX_SPACES_HELIOS_URL = heliosURL;
    }
  }, [spaceBackendURL, heliosURL]);

  const mutation = useMutation(tokenPOST, {
    onSuccess: async (data) => {
      await joinSpace(
        data.spaceJWT,
        endsAt,
        participantNameRef.current || user.participantName
      );
    },
  });

  const authenticate = useCallback(
    (spaceId: string, participantId: string) => {
      mutation.mutate({
        spaceId,
        participantId,
      });
    },
    [mutation]
  );

  const handleJoin = useCallback(() => {
    if (typeof id === "string" && canJoinSpace) {
      authenticate(id, `${participantNameRef.current}|${user.id}`);
    }
  }, [id, canJoinSpace, authenticate, user.id]);

  useEffect(() => {
    if (!isRouterReady) return;
    if (!id || Array.isArray(id)) {
      console.warn("No space selected");
      return;
    }
    router.events.on("routeChangeStart", leaveSpace);
    router.events.on("routeChangeComplete", handleJoin);
    return () => {
      router.events.off("routeChangeStart", leaveSpace);
      router.events.off("routeChangeComplete", handleJoin);
    };
  }, [
    id,
    user,
    router,
    handleJoin,
    leaveSpace,
    isRouterReady,
    user.participantName,
  ]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="This is your space room" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Flex height="100vh" overflow="hidden" direction="column">
        <BackgroundImageWrap>
          <Image
            alt="Starfield"
            src={starfield}
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
            }}
          />
        </BackgroundImageWrap>

        {/* required to handle auto play https://developer.chrome.com/blog/autoplay/ */}
        {user.interactionRequired ? (
          <UserInteractionPrompt
            onInteraction={handleJoin}
            participantNameRef={participantNameRef}
          />
        ) : (
          <Stage />
        )}
      </Flex>
    </>
  );
};

const { MUX_SPACES_BACKEND_URL = "", MUX_SPACES_HELIOS_URL = "" } = process.env;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  let passthrough;
  let createdAt;

  try {
    if (typeof id === "string") {
      ({ passthrough, created_at: createdAt } = await fetchSpace(id));
    }
  } catch (error) {}

  let props: Record<string, any> = {
    heliosURL: MUX_SPACES_HELIOS_URL,
    spaceBackendURL: MUX_SPACES_BACKEND_URL,
    title: passthrough ? `${passthrough} | Mux Meet` : "Mux Meet Space",
  };

  if (
    process.env.SPACE_DURATION_SECONDS &&
    passthrough === TEMPORARY_SPACE_PASSTHROUGH &&
    createdAt
  ) {
    props.endsAt = moment(createdAt * 1000)
      .add(process.env.SPACE_DURATION_SECONDS, "seconds")
      .valueOf();
  }

  return {
    props,
  };
};

export default SpacePage;
