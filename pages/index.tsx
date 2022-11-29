import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Select,
  Heading,
  Input,
  FormHelperText,
  Flex,
  Center,
  HStack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";

import UserContext from "context/user";
import { useDevices } from "hooks/useDevices";

import Header from "components/Header";
import SpaceMan from "components/SpaceMan";
import MicrophoneButton from "components/controls/buttons/MicrophoneButton";
import CameraButton from "components/controls/buttons/CameraButton";

const Home = () => {
  const router = useRouter();
  const { isReady: isRouterReady } = router;
  const { spaceId: spaceIdQuery } = router.query;
  const user = React.useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [spaceId, setSpaceId] = useState("");
  const [participantName, setParticipantName] = useState(user.participantName);
  const [joining, setJoining] = useState(false);
  const { requestPermissionAndPopulateDevices } = useDevices();

  const { data: spaces } = useQuery(["Spaces"], () =>
    fetch(`/api/spaces`)
      .then((res) => res.json())
      .then((spaceList: { passthrough: string; id: string }[]) => {
        return spaceList.filter((space) => {
          const label = space.passthrough ?? space.id;
          return !label.startsWith("slack");
        });
      })
  );

  const invalidSpaceId = useCallback(
    (spaceIdToCheck: string) => {
      let idValid = spaceIdToCheck && spaceIdToCheck !== "";
      let idCurrent = spaces?.some(
        (space: { id: string; passthrough: string }) =>
          space.id === spaceIdToCheck
      );
      return !idValid || !idCurrent;
    },
    [spaces]
  );

  useEffect(() => {
    if (!isRouterReady) return;

    if (typeof spaceIdQuery === "string" && !invalidSpaceId(spaceIdQuery)) {
      setSpaceId(spaceIdQuery);
    } else if (!invalidSpaceId(user.spaceId)) {
      setSpaceId(user.spaceId);
    } else if (spaces && spaces.length > 0) {
      setSpaceId(spaces[0].id);
    }

    requestPermissionAndPopulateDevices();
    setLoading(false);
  }, [
    spaces,
    spaceIdQuery,
    user.spaceId,
    isRouterReady,
    invalidSpaceId,
    user.participantName,
    requestPermissionAndPopulateDevices,
  ]);

  const invalidParticipantName = useMemo(
    () => !participantName,
    [participantName]
  );

  const disableJoin = useMemo(
    () => invalidParticipantName || invalidSpaceId(spaceId),
    [spaceId, invalidParticipantName, invalidSpaceId]
  );

  const handleSpaceIdChange = (event: { target: { value: string } }) => {
    setSpaceId(event.target.value);
  };

  const handleParticipantNameChange = (event: {
    target: { value: string };
  }) => {
    setParticipantName(event.target.value);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setJoining(true);

    user.setSpaceId!(spaceId);
    user.setParticipantName!(participantName);
    user.setInteractionRequired(false);

    router.push({
      pathname: `/space/${spaceId}`,
    });
  }

  return (
    <>
      <Head>
        <title>Mux Meet</title>
        <meta name="description" content="Real-time meetings powered by Mux" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Flex direction="column" height="100vh" backgroundColor="#323232">
        <Header />
        <Center height="100%" zIndex={1}>
          <Flex direction="column" align="center">
            <Box background="white" padding="4" borderRadius="4" width="360px">
              <form onSubmit={handleSubmit}>
                <Stack spacing="4">
                  <Heading>Join a Space</Heading>

                  <FormControl isInvalid={!loading && invalidParticipantName}>
                    <FormLabel>Your Name</FormLabel>
                    <Input
                      maxLength={40}
                      id="participant_name"
                      value={participantName}
                      onChange={handleParticipantNameChange}
                    />
                    <FormHelperText
                      color={
                        loading || !invalidParticipantName ? "white" : "#E22C3E"
                      }
                    >
                      This cannot be empty.
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Space</FormLabel>
                    <Select
                      onChange={handleSpaceIdChange}
                      value={spaceId}
                      disabled={!spaces}
                    >
                      {!spaces && <option>Loading...</option>}
                      {spaces &&
                        spaces.map((space: any) => {
                          const label = space.passthrough ?? space.id;
                          return (
                            <option key={space.id} value={space.id}>
                              {label}
                            </option>
                          );
                        })}
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    width="full"
                    isDisabled={disableJoin}
                    isLoading={joining}
                  >
                    Join
                  </Button>
                </Stack>
              </form>
            </Box>
            <HStack>
              <MicrophoneButton />
              <CameraButton />
            </HStack>
          </Flex>
        </Center>
        <SpaceMan />
      </Flex>
    </>
  );
};

export default Home;
