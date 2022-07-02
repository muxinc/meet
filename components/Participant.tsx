import React from "react";
import { Box, Center } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  LocalParticipant,
  RemoteParticipant,
  TrackSource,
} from "@mux/spaces-web";

import { useParticipant } from "hooks/useParticipant";
import VideoRenderer from "./renderers/VideoRenderer";
import ParticipantInfoBar from "./ParticipantInfoBar";

interface Props {
  width?: number;
  height?: number;
  participant: LocalParticipant | RemoteParticipant;
  local: boolean;
}

export default function Participant({
  width,
  height,
  participant,
  local = false,
}: Props): JSX.Element {
  const { isMuted, isSpeaking, isCameraOff, subscribedTracks } =
    useParticipant(participant);

  const cameraTrack = subscribedTracks.find(
    (track) => track.source === TrackSource.Camera
  );

  const outlineWidth = 3;

  return (
    <Box
      layout
      layoutId={participant.connectionId}
      as={motion.div}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      width={`${width! - outlineWidth * 2}px`}
      height={`${height! - outlineWidth * 2}px`}
      minWidth="160px"
      minHeight="90px"
      background="black"
      outline={`${isSpeaking ? `${outlineWidth}px solid` : "1px solid"}`}
      outlineColor={`${isSpeaking ? "#FB2491" : "black"}`}
      borderRadius="5px"
      margin={`${outlineWidth}px`}
      overflow="hidden"
      position="relative"
      role="group"
    >
      {cameraTrack && (
        <VideoRenderer
          connectionId={participant.connectionId}
          local={local}
          track={cameraTrack}
        />
      )}

      <ParticipantInfoBar
        isMuted={isMuted}
        participant={participant}
        parentHeight={height!}
      />

      {(isCameraOff || !cameraTrack) && (
        <Center
          background="black"
          color="white"
          fontSize="45px"
          h="100%"
          position="absolute"
          top="0"
          w="100%"
        >
          {participant.id.split("|")[0]}
        </Center>
      )}
    </Box>
  );
}
