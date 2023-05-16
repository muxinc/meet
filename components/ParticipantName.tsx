import { memo } from "react";
import { Box, Center, Flex } from "@chakra-ui/react";

interface Props {
  isSmall: boolean;
  children: string;
}

function ParticipantName({ isSmall, children }: Props): JSX.Element {
  return (
    <Center
      background="black"
      color="white"
      fontSize={isSmall ? "20px" : "45px"}
      h="100%"
      position="absolute"
      top="0"
      w="100%"
    >
      <Flex width="100%" direction="column" textAlign="center">
        <Box overflowWrap="anywhere">{children}</Box>
      </Flex>
    </Center>
  );
}

const MemoizedName = memo(ParticipantName);
export default MemoizedName;
