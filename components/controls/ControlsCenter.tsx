import React from "react";
import { HStack } from "@chakra-ui/react";

import MicrophoneButton from "./buttons/MicrophoneButton";
import CameraButton from "./buttons/CameraButton";
import ScreenShareButton from "./buttons/ScreenShareButton";
import SettingsButton from "./buttons/SettingsButton";

interface Props {
  onLeave: () => void;
  onRename: (newName: string) => void;
}

export default function ControlsCenter({
  onLeave,
  onRename,
}: Props): JSX.Element {
  return (
    <HStack>
      <MicrophoneButton />
      <CameraButton />
      <ScreenShareButton />
      <SettingsButton onLeave={onLeave} onRename={onRename} />
    </HStack>
  );
}
