import React from "react";
import { Flex } from "@chakra-ui/react";

import ControlsRight from "./controls/ControlsRight";
import ControlsLeft from "./controls/ControlsLeft";
import ControlsCenter from "./controls/ControlsCenter";

interface Props {
  hasPermissions: boolean;
  isLocalScreenShare: boolean;
  screenIsShared: boolean;
  toggleScreenShare: () => void;
}

export default function Controls({
  hasPermissions,
  isLocalScreenShare,
  screenIsShared,
  toggleScreenShare,
}: Props): JSX.Element {
  return (
    <Flex
      alignItems="center"
      backgroundColor="#333"
      bottom="0px"
      flexDirection="row"
      height="80px"
      justifyContent="space-between"
      left="0px"
      padding="10px 40px"
      position="fixed"
      width="100%"
      zIndex={1000}
    >
      <ControlsLeft />
      <ControlsCenter
        hasPermissions={hasPermissions}
        isLocalScreenShare={isLocalScreenShare}
        screenIsShared={screenIsShared}
        toggleScreenShare={toggleScreenShare}
      />
      <ControlsRight />
    </Flex>
  );
}
