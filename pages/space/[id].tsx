import React, { useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPage, GetServerSideProps } from "next";
import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { TrackSource } from "@mux/spaces-web";

import UserContext from "context/user";
import { useSpace } from "hooks/useSpace";
import { useDevices } from "hooks/useDevices";
import { tokenPOST } from "client/token";
import { fetchSpace } from "pages/api/spaces/[id]";

import Stage from "components/Stage";
import UserInteractionPrompt from "components/UserInteractionPrompt";

import starfield from "../../public/starfield-bg.jpg";

const BackgroundImageWrap = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: 0;
`;

interface Props {
  title: string;
}

const SpacePage: NextPage<Props> = ({ title }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { isReady: isRouterReady } = router;
  const { joinSpace, leaveSpace } = useSpace();
  const { requestPermissionAndGetLocalMedia } = useDevices();
  const user = React.useContext(UserContext);

  const mutation = useMutation(tokenPOST, {
    onSuccess: async (data) => {
      const localTracks = await requestPermissionAndGetLocalMedia(
        user.microphoneDeviceId,
        user.cameraOff ? undefined : user.cameraDeviceId
      );
      localTracks.forEach((localTrack) => {
        switch (localTrack.source) {
          case TrackSource.Camera:
            user.setCameraDeviceId(localTrack.deviceId ?? "");
            break;
          case TrackSource.Microphone:
            user.setMicrophoneDeviceId(localTrack.deviceId ?? "");
        }
      });
      const localParticipant = await joinSpace(data.spaceJWT);
      if (localParticipant) {
        const publishedTracks = await localParticipant.publishTracks(
          localTracks
        );

        if (user.microphoneMuted) {
          publishedTracks
            .filter((track) => track.source === TrackSource.Microphone)
            .forEach((track) => track.mute());
        }
      }
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
    if (typeof id === "string") {
      authenticate(id, user.participantId);
    }
  }, [id, authenticate, user.participantId]);

  const rejoinAs = useCallback(
    (participantId: string) => {
      if (typeof id === "string") {
        leaveSpace();
        authenticate(id, participantId);
      }
    },
    [id, leaveSpace, authenticate]
  );

  useEffect(() => {
    if (!isRouterReady) return;
    if (!id || Array.isArray(id)) {
      console.warn("No space selected");
      return;
    }
    if (!user.participantName) {
      router.replace({ pathname: "/", query: { spaceId: id } });
      return;
    }
    router.events.on("routeChangeStart", leaveSpace);
    router.events.on("routeChangeComplete", handleJoin);
    return () => {
      router.events.off("routeChangeStart", leaveSpace);
      router.events.off("routeChangeComplete", handleJoin);
    };
  }, [id, router, handleJoin, leaveSpace, isRouterReady, user.participantName]);

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
          <UserInteractionPrompt onInteraction={handleJoin} />
        ) : (
          <Stage rejoinCallback={rejoinAs} />
        )}
      </Flex>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  let passthrough;

  try {
    if (typeof id === "string") {
      ({ passthrough } = await fetchSpace(id));
    }
  } catch (error) {}

  return {
    props: {
      title: passthrough ? `${passthrough} | Mux Meet` : "Mux Meet Space",
    },
  };
};

export default SpacePage;
