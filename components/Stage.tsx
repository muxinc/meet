import React from "react";
import { Center, Heading, Spinner } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";

import SpaceMan from "./SpaceMan";
import Controls from "./Controls";
import Meeting from "./Meeting";
import Notifications from "./Notifications";

const LoadingSpinner = () => {
  return (
    <>
      <Spinner color="#fb2491" size="xl" />
      <Heading color="white" ml={5}>
        Joining Space...
      </Heading>
    </>
  );
};

interface Props {
  rejoinCallback: (participantId: string) => void;
}

export default function Stage({ rejoinCallback }: Props): JSX.Element {
  const { isJoined } = useSpace();

  return (
    <>
      <Notifications />
      <Center height="calc(100% - 80px)" zIndex={1}>
        {!isJoined ? <LoadingSpinner /> : <Meeting />}
      </Center>
      <Controls renameCallback={rejoinCallback} />
      <SpaceMan bottom="80px" />
    </>
  );
}
