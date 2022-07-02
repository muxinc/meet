import React from "react";
import { HStack } from "@chakra-ui/react";

import MicrophoneButton from "./buttons/MicrophoneButton";
import VideoButton from "./buttons/VideoButton";
import ScreenShareButton from "./buttons/ScreenShareButton";
import SettingsButton from "./buttons/SettingsButton";

export default function ControlsCenter(): JSX.Element {
  return (
    <HStack>
      <MicrophoneButton />
      <VideoButton />
      <ScreenShareButton />
      <SettingsButton />
    </HStack>
  );
}
