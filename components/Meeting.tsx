import React from "react";
import { Center, Flex } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";
import useWindowDimensions from "hooks/useWindowDimension";

import Gallery from "./Gallery";
import Timer from "./Timer";
import ScreenShareRenderer from "./renderers/ScreenShareRenderer";

const headerHeight = 80;

export default function Meeting(): JSX.Element {
  let gap = 10;
  const {
    participantCount,
    attachScreenShare,
    isScreenShareActive,
    spaceEndsAt,
  } = useSpace();
  const { width = 0, height = 0 } = useWindowDimensions();

  const paddingY = height < 600 ? 10 : 40;
  const paddingX = width < 800 ? 40 : 60;

  let galleryWidth = width - paddingX * 2;
  if (isScreenShareActive) {
    if (participantCount < 6) {
      galleryWidth = width * 0.25 - paddingX;
    } else {
      galleryWidth = width * 0.33 - paddingX / 2;
    }
    galleryWidth = Math.max(galleryWidth, 160);
  }
  let galleryHeight = height - headerHeight - paddingY * 2;

  let screenShareWidth = isScreenShareActive ? width - galleryWidth : 0;

  let direction: "row" | "column" = "row";
  if (width < height) {
    gap = 8;
    galleryWidth = width - paddingX * 2;
    if (isScreenShareActive) {
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
      {spaceEndsAt && <Timer />}
      <Center width={`${screenShareWidth}px`} maxHeight="100%">
        <ScreenShareRenderer attach={attachScreenShare} />
      </Center>
      <Gallery
        gap={gap}
        width={galleryWidth}
        height={galleryHeight}
        participantsPerPage={participantsPerPage}
      />
    </Flex>
  );
}
