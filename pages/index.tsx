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
} from "@chakra-ui/react";
import { useQuery } from "react-query";

import Header from "components/Header";
import SpaceMan from "components/SpaceMan";
import UserContext from "context/user";

const Home = () => {
  const router = useRouter();
  const user = React.useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [spaceId, setSpaceId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [joining, setJoining] = useState(false);

  const { data: spaces } = useQuery(["Spaces"], () =>
    fetch(`/api/spaces`).then((res) => res.json())
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
    if (!invalidSpaceId(user.spaceId)) {
      setSpaceId(user.spaceId);
    } else if (spaces && spaces.length > 0) {
      setSpaceId(spaces[0].id);
    }
    setParticipantName(user.participantName);
    setLoading(false);
  }, [spaces, user.spaceId, user.participantName, invalidSpaceId]);

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

      <Flex direction="column" height="100%" backgroundColor="#333">
        <Header />
        <Center height="100%">
          <Box
            background="white"
            padding="4"
            borderRadius="4"
            width="50%"
            minWidth="400px"
            maxWidth="700px"
          >
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
                  <FormHelperText hidden={loading || !invalidParticipantName}>
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
        </Center>
        <SpaceMan bottom="0px" />
      </Flex>
    </>
  );
};

export default Home;
