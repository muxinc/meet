import React from "react";
import { Center, Spinner } from "@chakra-ui/react";

import { useLocalParticipant } from "hooks/useLocalParticipant";
import Participant from "./Participant";

export default function LocalView(): JSX.Element {
  const localParticipant = useLocalParticipant();

  return !localParticipant ? (
    <Center height="100%">
      <Spinner colorScheme="purple" size="xl" />
    </Center>
  ) : (
    <Participant local={true} participant={localParticipant} />
  );
}
