import React from "react";
import { Flex } from "@chakra-ui/react";

import ControlsRight from "./controls/ControlsRight";
import ControlsLeft from "./controls/ControlsLeft";
import ControlsCenter from "./controls/ControlsCenter";

interface Props {
  onLeave: () => void;
}

export default function Controls({ onLeave }: Props): JSX.Element {
  return (
    <Flex
      alignItems="center"
      backgroundColor="#333"
      bottom="0px"
      flexDirection="row"
      height={{ base: "60px", sm: "80px" }}
      justifyContent="space-between"
      left="0px"
      padding="10px 40px"
      position="fixed"
      width="100%"
      zIndex={1000}
    >
      <ControlsLeft />
      <ControlsCenter />
      <ControlsRight onLeave={onLeave} />
    </Flex>
  );
}
