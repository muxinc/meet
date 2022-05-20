import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { SpaceProvider } from "hooks/SpaceProvider";
import Stage from "components/Stage";
import { useRouter } from "next/router";

const SpacePage: NextPage = () => {
  const router = useRouter();
  const { isReady: isRouterReady } = router;
  const { id, participantId } = router.query;
  const [spaceJWT, setSpaceJWT] = useState("");

  // GET request to get the JWT
  useEffect(() => {
    if (!isRouterReady) return;
    // wait for the useRouter hook to asynchronously get the space id and participant id
    if (!id) {
      console.warn("No space selected");
      return;
    }
    if (!participantId) {
      console.warn("No participant id specified");
      return;
    }

    const fetchJWT = async () => {
      const response = await fetch(
        `/api/token/${id}?participantId=${participantId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const parsedResponse = await response.json();
      setSpaceJWT(parsedResponse?.spaceJWT);
    };

    fetchJWT();
  }, [isRouterReady, id, participantId]);
  return (
    <>
      <Head>
        <title>Mux Meet Space</title>
        <meta name="description" content="A meeting app built on Mux Spaces" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <SpaceProvider jwt={spaceJWT}>
        <Stage />
      </SpaceProvider>
    </>
  );
};

export default SpacePage;
