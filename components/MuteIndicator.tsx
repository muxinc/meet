import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { IoMicOffOutline } from "react-icons/io5";

interface Props {
  isMuted: boolean;
}

export default function MuteIndicator({ isMuted }: Props): JSX.Element {
  return (
    <Box
      _groupHover={{
        opacity: 1,
        backgroundColor: "rgba(0,0,0,0)",
      }}
      background="rgba(68, 68, 68, 0.75)"
      borderRadius="10px"
      bottom="10px"
      color="white"
      left="0"
      marginX="2"
      marginY="0"
      position="absolute"
      textAlign="center"
      width="88px"
      zIndex={10}
    >
      {isMuted && (
        <Flex alignItems="center" color="#FFFFFF" px={2} py={1}>
          <Icon w={5} h={5} as={IoMicOffOutline} mr={0.5} />
          <Text fontSize={14} fontWeight="bold">
            Muted
          </Text>
        </Flex>
      )}
    </Box>
  );
}
