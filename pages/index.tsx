import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
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
import { useRouter } from "next/router";

import Header from "components/Header";
import SpaceMan from "components/SpaceMan";
import { useLocalStorage } from "hooks/useLocalStorage";

const Home = () => {
  const router = useRouter();

  const [spaceId, setSpaceId] = useLocalStorage("spaceId", "");
  const [participantId, setParticipantId] = useLocalStorage(
    "participantId",
    ""
  );
  const [spaces, setSpaces] = useState<
    { id: string; passthrough?: string }[] | null
  >(null);
  const [errors, setErrors] = useState({ participantId: false });
  const spaceIdValid = useCallback(() => {
    let idValid = spaceId && spaceId !== "";
    let idCurrent = spaces?.some((e) => e.id === spaceId);
    return idValid && idCurrent;
  }, [spaces, spaceId]);
  const participantInvalid = useCallback(
    () => !participantId || participantId.length < 2,
    [participantId]
  );
  let [joinDisabled, setJoinDisabled] = useState(true);

  // GET request to get the spaces and create options
  useEffect(() => {
    const fetchSpaces = async () => {
      const response = await fetch(`/api/spaces`, {
        headers: {
          "Cache-Control": "no-cache",
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const _spaces = await response.json();

      setSpaces(_spaces);
    };
    fetchSpaces();
  }, [setSpaces]);

  // manage join state
  useEffect(() => {
    setJoinDisabled(participantInvalid() || !spaceIdValid());
  }, [participantInvalid, spaceIdValid]);

  // manage spaces default
  useEffect(() => {
    if (!spaceIdValid() && spaces) {
      setSpaceId(spaces[0]?.id);
    }
  }, [spaces, setSpaceId, spaceIdValid]);

  const handleSpaceIdChange = (event: { target: { value: string } }) => {
    const _spaceId = event.target.value;
    setSpaceId(_spaceId);
  };

  const handleParticipantIdChange = (event: { target: { value: string } }) => {
    const _participantId = event.target.value;
    setParticipantId(_participantId);
    setErrors({ participantId: participantInvalid() });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    router.push({
      pathname: `/space/${spaceId}`,
      query: { participantId: participantId },
    });
  }

  return (
    <>
      <Head>
        <title>Mux Meet</title>
        <meta name="description" content="A meeting app built on Mux Spaces" />
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

                <FormControl isInvalid={errors.participantId}>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    id="participant_id"
                    value={participantId}
                    onChange={handleParticipantIdChange}
                  />
                  <FormHelperText>This cannot be empty.</FormHelperText>
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

                <Button type="submit" width="full" isDisabled={joinDisabled}>
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
