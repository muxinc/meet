import React from "react";
import { IconButton, Image, Tooltip } from "@chakra-ui/react";

import { useScreenShare } from "hooks/useScreenShare";

export default function ScreenShareButton(): JSX.Element {
  const { isLocalScreenShare, screenShareTrack, toggleScreenShare } =
    useScreenShare();

  let stopScreenShare = (
    <Image
      alt="screen share on"
      width="25px"
      height="25px"
      src="/screenShareOn.svg"
    />
  );

  let startScreenShare = (
    <Image
      alt="screen share off"
      width="25px"
      height="25px"
      src="/screenShareOff.svg"
    />
  );

  return (
    <Tooltip
      label={
        screenShareTrack
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
        icon={screenShareTrack ? stopScreenShare : startScreenShare}
        onClick={toggleScreenShare}
        _hover={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(251, 36, 145, 0.6) 0%, rgba(251, 36, 145, 0) 100%);",
        }}
      />
    </Tooltip>
  );
}
