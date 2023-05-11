import React from "react";
import { HStack } from "@chakra-ui/react";

import MicrophoneButton from "./buttons/MicrophoneButton";
import CameraButton from "./buttons/CameraButton";
import ScreenShareButton from "./buttons/ScreenShareButton";
import SettingsButton from "./buttons/SettingsButton";
import ChatButton from "./buttons/ChatButton";
import useWindowDimensions from "hooks/useWindowDimension";
import { useSpace } from "hooks/useSpace";

interface Props {
  onLeave: () => void;
}

export default function ControlsCenter({ onLeave }: Props): JSX.Element {
  const { width = 0 } = useWindowDimensions();
  const { isLocalScreenShareSupported } = useSpace();

  return (
    <HStack spacing="24px">
      <MicrophoneButton />
      <CameraButton />
      {isLocalScreenShareSupported && <ScreenShareButton />}
      {width > 800 && <ChatButton />}
      <SettingsButton onLeave={onLeave} />
    </HStack>
  );
}
