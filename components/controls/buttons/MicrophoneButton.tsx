import React, { useEffect, useState } from "react";
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { AiOutlineCheck } from "react-icons/ai";

import { useDevices } from "hooks/useDevices";
import { useLocalStorage } from "hooks/useLocalStorage";

import ChevronIcon from "components/icons/ChevronIcon";

interface Props {}

export default function MicrophoneButton({}: Props): JSX.Element {
  const {
    audioDevices,
    selectedAudioDeviceId,
    audioMuted,
    audioTrack,
    changeAudioDevice,
  } = useDevices();
  const [tempUnmute, setTempUnmute] = useState(false);
  const [_, setPersistedAudioDeviceId] = useLocalStorage("audioDeviceId", "");

  useEffect(() => {
    setPersistedAudioDeviceId(selectedAudioDeviceId);
  }, [selectedAudioDeviceId, setPersistedAudioDeviceId]);

  let micMuteIcon = (
    <Image alt="mute mic" width="25px" height="25px" src="/microphoneOff.svg" />
  );

  let micUnmuteIcon = (
    <Image
      alt="unmute mic"
      width="25px"
      height="25px"
      src="/microphoneOn.svg"
    />
  );

  const toggleMicMuted = () => {
    if (audioMuted) {
      audioTrack?.unMute();
    } else {
      audioTrack?.mute();
    }
    setTempUnmute(false);
  };

  const hotkeyText = "⌘ + d"; // adding this here to make it easy to change later. appears in tooltip on button.
  useHotkeys(
    "cmd+d,ctrl+d",
    (e) => {
      e.preventDefault();
      toggleMicMuted();
    },
    [audioTrack]
  );

  const handleTempUnmuteHotkeyDown = () => {
    if (audioMuted && !tempUnmute) {
      setTempUnmute(true);
      audioTrack?.unMute();
    }
  };

  const handleTempUnmuteHotkeyUp = () => {
    if (tempUnmute) {
      audioTrack?.mute();
      setTempUnmute(false);
    }
  };

  useHotkeys("space", handleTempUnmuteHotkeyDown, { keydown: true }, [
    audioTrack,
    tempUnmute,
  ]);
  useHotkeys("space", handleTempUnmuteHotkeyUp, { keyup: true }, [
    audioTrack,
    tempUnmute,
  ]);

  const ariaLabel = audioMuted ? "Unmute" : "Mute";

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Tooltip
        label={audioMuted ? `Unmute (${hotkeyText})` : `Mute (${hotkeyText})`}
      >
        <IconButton
          width="60px"
          height="60px"
          variant="link"
          aria-label={ariaLabel}
          icon={audioMuted ? micMuteIcon : micUnmuteIcon}
          onClick={toggleMicMuted}
          _hover={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(251, 36, 145, 0.6) 0%, rgba(251, 36, 145, 0) 100%);",
          }}
        />
      </Tooltip>
      <Menu placement="top">
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<ChevronIcon />}
          variant="link"
          marginLeft="-16px"
          zIndex={100}
        />
        <MenuList
          background="#383838"
          border="1px solid #323232"
          color="#CCCCCC"
          padding="5px 10px"
        >
          <Text userSelect="none" paddingX="12px" paddingY="6px">
            MICROPHONE
          </Text>
          {audioDevices.map((device: MediaDeviceInfo) => {
            return (
              <MenuItem
                key={device.deviceId}
                onClick={() => changeAudioDevice(device.deviceId)}
              >
                <Flex alignItems="center">
                  {device.label}
                  {selectedAudioDeviceId == device.deviceId && (
                    <Box marginLeft="10px">
                      <AiOutlineCheck />
                    </Box>
                  )}
                </Flex>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </ButtonGroup>
  );
}
