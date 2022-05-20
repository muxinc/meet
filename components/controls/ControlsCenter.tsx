import React from "react";
import { ButtonGroup } from "@chakra-ui/react";

import ReactTooltip from "react-tooltip";
import MicrophoneButton from "./buttons/MicrophoneButton";
import VideoButton from "./buttons/VideoButton";
import ScreenShareButton from "./buttons/ScreenShareButton";
import SettingsButton from "./buttons/SettingsButton";

interface Props {
  hasPermissions: boolean;
  isLocalScreenShare: boolean;
  screenIsShared: boolean;
  toggleScreenShare: () => void;
}

export default function ControlsCenter({
  hasPermissions,
  isLocalScreenShare,
  screenIsShared,
  toggleScreenShare,
}: Props): JSX.Element {
  return (
    <div>
      <ButtonGroup>
        <ReactTooltip uuid="controlButton-tooltip" effect="solid" />
        <MicrophoneButton hasPermissions={hasPermissions} />
        <VideoButton hasPermissions={hasPermissions} />
        <ScreenShareButton
          isLocalScreenShare={isLocalScreenShare}
          screenIsShared={screenIsShared}
          toggleScreenShare={toggleScreenShare}
        />
        <SettingsButton />
      </ButtonGroup>
    </div>
  );
}
