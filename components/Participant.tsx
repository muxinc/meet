import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { LocalParticipant, RemoteParticipant } from "@mux/spaces-web";

import { useParticipant } from "hooks/useParticipant";

import Pin from "./Pin";
import VideoRenderer from "./renderers/VideoRenderer";
import ParticipantInfoBar from "./ParticipantInfoBar";

interface Props {
  width?: number;
  height?: number;
  participant: LocalParticipant | RemoteParticipant;
}

export default function Participant({
  width,
  height,
  participant,
}: Props): JSX.Element {
  const { isLocal, isMicrophoneMuted, isSpeaking, cameraTrack } =
    useParticipant(participant);

  const outlineWidth = 3;

  return (
    <Box
      width={`${width! - outlineWidth * 2}px`}
      height={`${height! - outlineWidth * 2}px`}
      minWidth="160px"
      minHeight="90px"
      background="black"
      outline={`${
        !isMicrophoneMuted && isSpeaking
          ? `${outlineWidth}px solid`
          : "1px solid"
      }`}
      outlineColor={`${!isMicrophoneMuted && isSpeaking ? "#FB2491" : "black"}`}
      borderRadius="5px"
      margin={`${outlineWidth}px`}
      overflow="hidden"
      position="relative"
      role="group"
    >
      <VideoRenderer
        connectionId={participant.connectionId}
        local={isLocal}
        track={cameraTrack}
      />

      <ParticipantInfoBar
        isMuted={isMicrophoneMuted}
        participant={participant}
        parentHeight={height!}
      />

      {!cameraTrack && (
        <Center
          background="black"
          color="white"
          fontSize="45px"
          h="100%"
          position="absolute"
          top="0"
          w="100%"
        >
          <Flex direction="column" textAlign="center">
            <Box>{participant.id.split("|")[0]}</Box>
          </Flex>
        </Center>
      )}

      {!isLocal && <Pin connectionId={participant.connectionId} />}
    </Box>
  );
}
