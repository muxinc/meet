import React from "react";
import { Flex } from "@chakra-ui/react";

import { useScreenShare } from "hooks/useScreenShare";
import { useParticipants } from "hooks/useParticipants";
import useWindowDimensions from "hooks/useWindowDimension";

import Gallery from "./Gallery";
import ScreenShare from "./ScreenShare";

const headerHeight = 80;

export default function Meeting(): JSX.Element {
  let gap = 10;
  const participants = useParticipants();
  const { screenShareTrack } = useScreenShare();
  const { width = 0, height = 0 } = useWindowDimensions();

  const paddingY = height < 600 ? 10 : 40;
  const paddingX = width < 800 ? 40 : 60;

  const totalParticipants = 1 + participants.length;

  let galleryWidth = width - paddingX * 2;
  if (screenShareTrack) {
    if (totalParticipants < 6) {
      galleryWidth = width * 0.25 - paddingX;
    } else {
      galleryWidth = width * 0.33 - paddingX / 2;
    }
    galleryWidth = Math.max(galleryWidth, 160);
  }
  let galleryHeight = height - headerHeight - paddingY * 2;

  let screenShareWidth = width - galleryWidth;

  let direction: "row" | "column" = "row";
  if (width < height) {
    gap = 8;
    galleryWidth = width - paddingX * 2;
    if (screenShareTrack) {
      direction = "column";
      screenShareWidth = width;
      galleryHeight = height - headerHeight - (width / 4) * 3;
    }
  }

  let scaleFactor = 2.25;
  const rows = Math.max(Math.ceil(galleryHeight / (90 * scaleFactor)), 1);
  const columns = Math.max(Math.ceil(galleryWidth / (160 * scaleFactor)), 1);

  const participantsPerPage = Math.round(rows * columns);

  return (
    <Flex
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      direction={direction}
    >
      {screenShareTrack && (
        <ScreenShare
          screenShareTrack={screenShareTrack}
          width={screenShareWidth}
        />
      )}
      <Gallery
        gap={gap}
        width={galleryWidth}
        height={galleryHeight}
        participantsPerPage={participantsPerPage}
      />
    </Flex>
  );
}
