import React from "react";
import { Box } from "@chakra-ui/react";
import { LocalParticipant, RemoteParticipant } from "@mux/spaces-web";

import MuteIndicator from "./MuteIndicator";

interface Props {
  participant: LocalParticipant | RemoteParticipant;
  isMuted: boolean;
}

export default function ParticipantInfoBar({
  isMuted,
  participant,
}: Props): JSX.Element {
  return (
    <>
      <MuteIndicator isMuted={isMuted} />
      <Box
        _groupHover={{
          color: "white",
          background: "rgba(50, 50, 50, 0.5)",
        }}
        backgroundColor="transparent"
        bottom="0"
        color={"transparent"}
        fontSize="14px"
        fontWeight="700"
        left="0"
        paddingY="3.5"
        position="absolute"
        right="0"
        textAlign="center"
        width="100%"
      >
        {participant.id}
      </Box>
    </>
  );
}
