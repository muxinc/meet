import React, { useMemo } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";

import UserContext from "context/User";
import { useParticipant } from "hooks/useParticipant";

import Pin from "./Pin";
import VideoRenderer from "./renderers/VideoRenderer";
import ParticipantInfoBar from "./ParticipantInfoBar";
import ParticipantName from "./ParticipantName";

interface Props {
  width?: number;
  height?: number;
  connectionId: string;
}

export default function Participant({
  width,
  height,
  connectionId,
}: Props): JSX.Element {
  const {
    id,
    isLocal,
    isSpeaking,
    hasMicTrack,
    isMicTrackMuted,
    isCameraOff,
    cameraWidth,
    cameraHeight,
    displayName,
    attachVideoElement,
  } = useParticipant(connectionId);

  const outlineWidth = 3;

  return (
    <Box
      width={`${width! - outlineWidth * 2}px`}
      height={`${height! - outlineWidth * 2}px`}
      minWidth="160px"
      minHeight="90px"
      background="black"
      boxShadow={`0 0 0 ${
        !isMicTrackMuted && isSpeaking ? outlineWidth : 1
      }px ${!isMicTrackMuted && isSpeaking ? "#FA50B5" : "black"}`}
      borderRadius="5px"
      margin={`${outlineWidth}px`}
      overflow="hidden"
      position="relative"
      role="group"
    >
      <VideoRenderer
        local={isLocal}
        width={cameraWidth}
        height={cameraHeight}
        attachFunc={attachVideoElement}
        connectionId={connectionId}
      />

      <ParticipantInfoBar
        name={displayName || id}
        isMuted={!hasMicTrack || isMicTrackMuted}
        parentHeight={height!}
      />

      {isCameraOff && (
        <ParticipantName isSmall={width! <= 400}>
          {displayName || id}
        </ParticipantName>
      )}

      {!isLocal && <Pin connectionId={connectionId} />}
    </Box>
  );
}
