import React from "react";
import { IconButton, Tooltip } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";

import ScreenShareIcon from "../../icons/ScreenShareIcon";

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
            ? "Stop screen-share"
            : "Someone else is currently screen-sharing"
          : "Share Screen"
      }
    >
      <IconButton
        variant="control"
        aria-label="Share Screen"
        isDisabled={isScreenShareActive && !isLocalScreenShare}
        icon={<ScreenShareIcon />}
        {...(isLocalScreenShare && {
          background: "#3E4247",
          border: "1px solid #FFFFFF",
        })}
        onClick={isLocalScreenShare ? stopScreenShare : startScreenShare}
      />
    </Tooltip>
  );
}
