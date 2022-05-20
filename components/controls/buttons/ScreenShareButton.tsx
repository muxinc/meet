import { Image } from "@chakra-ui/react";
import React from "react";

import ControlsButton from "../ControlsButton";

interface Props {
  isLocalScreenShare: boolean;
  screenIsShared: boolean;
  toggleScreenShare: () => void;
}

export default function ScreenShareButton({
  isLocalScreenShare,
  screenIsShared,
  toggleScreenShare,
}: Props): JSX.Element {
  let stopScreenShare = (
    <Image
      alt="mute camera"
      width="25px"
      height="25px"
      src="/screenShareOn.svg"
    />
  );

  let startScreenShare = (
    <Image
      alt="unmute camera"
      width="25px"
      height="25px"
      src="/screenShareOff.svg"
    />
  );

  return (
    <ControlsButton
      icon={
        screenIsShared && isLocalScreenShare
          ? stopScreenShare
          : startScreenShare
      }
      aria-label="Share Screen"
      toolTipLabel={
        screenIsShared && isLocalScreenShare
          ? "Stop Screenshare"
          : "Share Screen"
      }
      onToggle={toggleScreenShare}
    />
  );
}
