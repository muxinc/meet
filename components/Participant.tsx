import React from "react";
import { Box, Center, GridItem } from "@chakra-ui/react";
import { LocalParticipant, RemoteParticipant, TrackSource } from "@mux/spaces";

import { useParticipant } from "hooks/useParticipant";
import AudioRenderer from "./renderers/AudioRenderer";
import VideoRenderer from "./renderers/VideoRenderer";
import ParticipantInfoBar from "./ParticipantInfoBar";

interface Props {
  participant: LocalParticipant | RemoteParticipant;
  local: boolean;
}

export default function Participant({
  participant,
  local = false,
}: Props): JSX.Element {
  const { isMuted, isSpeaking, isCameraOff, subscribedTracks } =
    useParticipant(participant);

  const micTrack = subscribedTracks.find(
    (track) => track.source === TrackSource.Microphone
  );

  const cameraTrack = subscribedTracks.find(
    (track) => track.source === TrackSource.Camera
  );

  return (
    <GridItem
      background="black"
      border="3px solid"
      borderColor={`${isSpeaking ? "#FB2491" : "black"}`}
      borderRadius="5px"
      overflow="hidden"
      position="relative"
      role="group"
      textAlign="center"
      width="100%"
      sx={{
        "&:hover": {
          boxShadow: "0 0 15px 5px var(--chakra-colors-grey600)",
        },
      }}
    >
      <Box width="100%" height="100%" position="relative" borderRadius="5px">
        {!local && micTrack && <AudioRenderer track={micTrack} />}

        {cameraTrack && (
          <VideoRenderer
            connectionId={participant.connectionId}
            local={local}
            track={cameraTrack}
          />
        )}

        <ParticipantInfoBar isMuted={isMuted} participant={participant} />

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
            {participant.id}
          </Center>
        )}
      </Box>
    </GridItem>
  );
}
