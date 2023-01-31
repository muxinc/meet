import React from "react";
import { IconButton, Tooltip } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";

import ScreenShareOnIcon from "../../icons/ScreenShareOnIcon";
import ScreenShareOffIcon from "../../icons/ScreenShareOffIcon";

export default function ScreenShareButton(): JSX.Element {
  const {
    isLocalScreenShare,
    isScreenShareActive,
    startScreenShare,
    stopScreenShare,
  } = useSpace();

  return (
    <Tooltip
      label={
        isScreenShareActive
          ? isLocalScreenShare
            ? "Stop Screenshare"
            : "Screen being shared"
          : "Share Screen"
      }
    >
      <IconButton
        width="60px"
        height="60px"
        variant="link"
        aria-label="Share Screen"
        icon={
          isScreenShareActive ? <ScreenShareOnIcon /> : <ScreenShareOffIcon />
        }
        onClick={isScreenShareActive ? stopScreenShare : startScreenShare}
        _hover={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(251, 36, 145, 0.6) 0%, rgba(251, 36, 145, 0) 100%);",
        }}
      />
    </Tooltip>
  );
}
