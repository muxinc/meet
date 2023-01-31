import React, { useMemo } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";

import { useParticipant } from "hooks/useParticipant";

import Pin from "./Pin";
import VideoRenderer from "./renderers/VideoRenderer";
import ParticipantInfoBar from "./ParticipantInfoBar";

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
    isMicrophoneMuted,
    isCameraOff,
    cameraWidth,
    cameraHeight,
    attachCamera,
  } = useParticipant(connectionId);

  const displayName = useMemo(() => {
    return id.split("|")[0];
  }, [id]);

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
        local={isLocal}
        width={cameraWidth}
        height={cameraHeight}
        attach={attachCamera}
        connectionId={connectionId}
      />

      <ParticipantInfoBar
        name={displayName}
        isMuted={isMicrophoneMuted}
        parentHeight={height!}
      />

      {isCameraOff && (
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
            <Box>{displayName}</Box>
          </Flex>
        </Center>
      )}

      {!isLocal && <Pin connectionId={connectionId} />}
    </Box>
  );
}
