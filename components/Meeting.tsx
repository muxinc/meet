import React, { useContext } from "react";
import { Center, Flex } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";
import useWindowDimensions from "hooks/useWindowDimension";

import Gallery from "./Gallery";
import Timer from "./Timer";
import ScreenShareRenderer from "./renderers/ScreenShareRenderer";
import ChatRenderer from "./renderers/ChatRenderer";
import ChatContext from "context/Chat";

const headerHeight = 80;
const chatWidth = 300;

export default function Meeting(): JSX.Element {
  let gap = 10;
  const {
    participantCount,
    attachScreenShare,
    isScreenShareActive,
    spaceEndsAt,
  } = useSpace();
  const { isChatOpen } = useContext(ChatContext);
  const { width = 0, height = 0 } = useWindowDimensions();

  const availableWidth = width - (isChatOpen && width > 800 ? chatWidth : 0);

  const paddingY = height < 600 ? 10 : 40;
  const paddingX = availableWidth < 800 ? 40 : 60;

  let galleryWidth = availableWidth - paddingX * 2;
  if (isScreenShareActive) {
    if (participantCount < 6) {
      galleryWidth = availableWidth * 0.25 - paddingX;
    } else {
      galleryWidth = availableWidth * 0.33 - paddingX / 2;
    }
    galleryWidth = Math.max(galleryWidth, 160);
  }
  let galleryHeight = height - headerHeight - paddingY * 2;

  let screenShareWidth = isScreenShareActive
    ? availableWidth - galleryWidth
    : 0;

  let direction: "row" | "column" = "row";
  if (width < height) {
    gap = 8;
    galleryWidth = availableWidth - paddingX * 2;
    if (isScreenShareActive) {
      direction = "column";
      screenShareWidth = availableWidth;
      galleryHeight = height - headerHeight - (availableWidth / 4) * 3;
    }
  }

  let scaleFactor = 2.25;
  const rows = Math.max(Math.ceil(galleryHeight / (90 * scaleFactor)), 1);
  const columns = Math.max(Math.ceil(galleryWidth / (160 * scaleFactor)), 1);

  const participantsPerPage = Math.round(rows * columns);

  return (
    <Flex width="100%" height="100%" direction="row" position="relative">
      {spaceEndsAt && <Timer />}
      <Flex
        maxWidth={availableWidth}
        height="100%"
        alignItems="center"
        justifyContent="center"
        direction={direction}
        flexGrow={1}
      >
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
      <ChatRenderer show={width > 800 && isChatOpen} />
    </Flex>
  );
}
