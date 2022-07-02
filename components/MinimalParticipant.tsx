import React, { useEffect, useRef, useState } from "react";
import { Box, Center, IconButton } from "@chakra-ui/react";
import {
  LocalParticipant,
  RemoteParticipant,
  TrackSource,
} from "@mux/spaces-web";
import { MdOutlinePushPin, MdPushPin } from "react-icons/md";

import { useParticipant } from "hooks/useParticipant";
import VideoRenderer from "./renderers/VideoRenderer";
import ParticipantInfoBar from "./ParticipantInfoBar";

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
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { isMuted, isSpeaking, isCameraOff, subscribedTracks } =
    useParticipant(participant);

  useEffect(() => {
    if (!targetRef.current) return;
    const current = targetRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    resizeObserver.observe(current);
    return () => {
      resizeObserver.unobserve(current);
    };
  }, []);

  const cameraTrack = subscribedTracks.find(
    (track) => track.source === TrackSource.Camera
  );

  return (
    <Box
      ref={targetRef}
      border="3px solid"
      borderColor={`${isSpeaking ? "#F82787" : "black"}`}
      borderRadius="5px"
      maxHeight="100%"
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
        parentHeight={dimensions.height}
      />

      {(isCameraOff || !cameraTrack) && (
        <Center
          background="black"
          position="absolute"
          top="0"
          w="100%"
          h="100%"
          color="white"
          fontSize="20px"
        >
          {participant.id.split("|")[0]}
        </Center>
      )}

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
    </Box>
  );
}
