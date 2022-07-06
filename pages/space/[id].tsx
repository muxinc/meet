import React, { useEffect } from "react";
import { useMutation } from "react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useLocalStorage } from "hooks/useLocalStorage";
import { SpaceProvider } from "hooks/SpaceProvider";
import { createToken } from "api/token";

import Stage from "components/Stage";
import UserInteractionPrompt from "components/UserInteractionPrompt";
import UserContext from "context/user";

const SpacePage: NextPage = () => {
  const router = useRouter();
  const { isReady: isRouterReady } = router;
  const { id } = router.query;
  const user = React.useContext(UserContext);

  const [persistedAudioDeviceId] = useLocalStorage("audioDeviceId", "");
  const [persistedVideoDeviceId] = useLocalStorage("videoDeviceId", "");

  const mutation = useMutation(createToken);

  useEffect(() => {
    if (!isRouterReady) return;
    if (!id) {
      console.warn("No space selected");
      return;
    }
    if (!user.participantName) {
      user.setPromptForName!(true);
      user.setInteractionRequired(false);
      return;
    }
    if (!user.interactionRequired) {
      mutation.mutate({
        spaceId: Array.isArray(id) ? id[0] : id,
        participantId: user.participantId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRouterReady,
    id,
    user.participantId,
    user.participantName,
    user.interactionRequired,
    user.promptForName,
    user.setPromptForName,
  ]);

  return (
    <>
      <Head>
        <title>Mux Meet Space</title>
        <meta name="description" content="Real-time meetings powered by Mux" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <SpaceProvider
        jwt={mutation.data?.spaceJWT}
        defaultAudioDeviceId={persistedAudioDeviceId}
        defaultVideoDeviceId={persistedVideoDeviceId}
      >
        {/* required to handle auto play https://developer.chrome.com/blog/autoplay/ */}
        {user.interactionRequired ? <UserInteractionPrompt /> : <Stage />}
      </SpaceProvider>
    </>
  );
};

export default SpacePage;
