import React from "react";
import { HStack } from "@chakra-ui/react";

import MicrophoneButton from "./buttons/MicrophoneButton";
import CameraButton from "./buttons/CameraButton";
import ScreenShareButton from "./buttons/ScreenShareButton";
import SettingsButton from "./buttons/SettingsButton";
import ChatButton from "./buttons/ChatButton";
import useWindowDimensions from "hooks/useWindowDimension";

interface Props {
  onLeave: () => void;
}

export default function ControlsCenter({ onLeave }: Props): JSX.Element {
  const { width = 0, height = 0 } = useWindowDimensions();

  return (
    <HStack spacing="24px">
      <MicrophoneButton />
      <CameraButton />
      {!!navigator.mediaDevices.getDisplayMedia && <ScreenShareButton />}
      {width > 800 && <ChatButton />}
      <SettingsButton onLeave={onLeave} />
    </HStack>
  );
}
