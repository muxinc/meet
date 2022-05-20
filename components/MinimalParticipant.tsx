import React from "react";
import { Box, Center, IconButton } from "@chakra-ui/react";
import { LocalParticipant, RemoteParticipant, TrackSource } from "@mux/spaces";
import { MdOutlinePushPin, MdPushPin } from "react-icons/md";

import { useParticipant } from "hooks/useParticipant";
import AudioRenderer from "./renderers/AudioRenderer";
import VideoRenderer from "./renderers/VideoRenderer";
import MuteIndicator from "./MuteIndicator";

interface Props {
  participant: LocalParticipant | RemoteParticipant;
  pinnedConnectionId?: string;
  setPinnedConnectionId?: (connectionId: string) => void;
  local?: boolean;
}

export default function MinimalParticipant({
  participant,
  pinnedConnectionId,
  setPinnedConnectionId,
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
    <Box
      border="3px solid"
      borderColor={`${isSpeaking ? "#F82787" : "black"}`}
      borderRadius="5px"
      maxHeight="100%"
      overflow="hidden"
      position="relative"
      role="group"
    >
      {!local && micTrack && <AudioRenderer track={micTrack} />}

      {cameraTrack && (
        <VideoRenderer
          connectionId={participant.connectionId}
          local={local}
          track={cameraTrack}
        />
      )}

      <Box
        _groupHover={{
          opacity: 0,
        }}
      >
        <MuteIndicator isMuted={isMuted} />
      </Box>

      {/* Note: pinning is disabled for yourself */}
      <IconButton
        size="xs"
        hidden={typeof setPinnedConnectionId === "undefined"}
        aria-label="pin"
        onClick={() => {
          if (setPinnedConnectionId) {
            if (pinnedConnectionId === participant.connectionId) {
              setPinnedConnectionId("");
            } else {
              setPinnedConnectionId(participant.connectionId);
            }
          }
        }}
        variant="solid"
        position="absolute"
        right={1}
        top={1}
        icon={
          setPinnedConnectionId &&
          pinnedConnectionId === participant.connectionId ? (
            <MdPushPin />
          ) : (
            <MdOutlinePushPin />
          )
        }
      />

      {isCameraOff || !cameraTrack ? (
        <Center
          background="black"
          position="absolute"
          top="0"
          w="100%"
          h="100%"
          color="white"
          fontSize="20px"
        >
          {participant.id}
        </Center>
      ) : (
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          backgroundColor="#555"
          color="white"
          textAlign="center"
          paddingX="4"
          paddingY="1"
          opacity={0}
          _groupHover={{ opacity: 0.5 }}
        >
          {participant.id}
        </Box>
      )}
    </Box>
  );
}
