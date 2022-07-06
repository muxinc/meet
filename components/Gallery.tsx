import React from "react";
import { Box } from "@chakra-ui/react";

import useWindowDimensions from "hooks/useWindowDimension";
import { useParticipants } from "hooks/useParticipants";
import { useLocalParticipant } from "hooks/useLocalParticipant";

import Participant from "./Participant";
import GalleryLayout from "./GalleryLayout";
import ParticipantAudio from "./ParticipantAudio";

export default function Gallery(): JSX.Element {
  const { width = 0, height = 0 } = useWindowDimensions();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();

  const galleryWidth = width - 40;
  const galleryHeight = height - 120;

  return (
    <Box
      width="100%"
      height="100%"
      maxHeight="100%"
      padding="20px"
      marginBottom="80px"
      zIndex={100}
    >
      {participants?.map((participant) => (
        <ParticipantAudio
          key={participant.connectionId}
          participant={participant}
        />
      ))}
      <GalleryLayout width={galleryWidth} height={galleryHeight}>
        {localParticipant && (
          <Participant local participant={localParticipant} />
        )}
        {participants?.map((participant) => {
          return (
            <Participant
              key={participant.id}
              local={false}
              participant={participant}
            />
          );
        })}
      </GalleryLayout>
    </Box>
  );
}
