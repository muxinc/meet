import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoMicOffOutline } from "react-icons/io5";

interface Props {
  isMuted: boolean;
  parentHeight: number;
}

export default function MuteIndicator({
  isMuted,
  parentHeight,
}: Props): JSX.Element {
  let left = "2px";
  let bottom = "15%";
  let marginLeft = "3";
  let iconWidth = "5";
  let iconHeight = "5";
  let borderRadius = "10px";
  let paddingX = "2";
  let paddingY = "1";
  if (parentHeight <= 250) {
    left = "0";
    bottom = "5%";
    marginLeft = "1";
  }
  if (parentHeight <= 200) {
    paddingX = "1";
    borderRadius = "0 10px 0 0";
    bottom = "0";
    marginLeft = "0";
    iconWidth = "12px";
    iconHeight = "12px";
  }
  if (parentHeight <= 90) {
    paddingX = "0";
    paddingY = "1.5px";
    borderRadius = "0";
  }

  return (
    <Box
      _groupHover={{
        opacity: 1,
        backgroundColor: "transparent",
      }}
      background="rgba(68, 68, 68, 0.75)"
      borderRadius={borderRadius}
      color="white"
      marginLeft={marginLeft}
      marginY="0"
      py={paddingY}
      zIndex={10}
      position="absolute"
      left={left}
      bottom={bottom}
    >
      {isMuted && (
        <Flex alignItems="center" color="#FFFFFF" px={paddingX}>
          <Icon w={iconWidth} h={iconHeight} as={IoMicOffOutline} />
        </Flex>
      )}
    </Box>
  );
}
