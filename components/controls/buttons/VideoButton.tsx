import React, { useEffect } from "react";
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

export default function VideoButton({}: Props): JSX.Element {
  const {
    videoDevices,
    selectedVideoDeviceId,
    videoOff,
    videoTrack,
    toggleVideo,
    changeVideoDevice,
  } = useDevices();
  const [_, setPersistedVideoDeviceId] = useLocalStorage("videoDeviceId", "");

  useEffect(() => {
    setPersistedVideoDeviceId(selectedVideoDeviceId);
  }, [selectedVideoDeviceId, setPersistedVideoDeviceId]);

  let cameraUnmuteIcon = (
    <Image
      alt="unmute camera"
      width="25px"
      height="25px"
      src="/cameraOff.svg"
    />
  );

  let cameraMuteIcon = (
    <Image alt="mute camera" width="25px" height="25px" src="/cameraOn.svg" />
  );

  const hotkeyText = "⌘ + e"; // adding this here to make it easy to change later. appears in tooltip on button.
  useHotkeys(
    "cmd+e,ctrl+e",
    (e) => {
      e.preventDefault();
      toggleVideo();
    },
    [videoTrack]
  );

  const ariaLabel = videoOff ? "Unhide" : "Hide";

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Tooltip
        label={
          videoOff
            ? `Enable Video (${hotkeyText})`
            : `Disable Video (${hotkeyText})`
        }
      >
        <IconButton
          width="60px"
          height="60px"
          variant="link"
          aria-label={ariaLabel}
          icon={videoOff ? cameraUnmuteIcon : cameraMuteIcon}
          onClick={toggleVideo}
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
            CAMERA
          </Text>
          {videoDevices.map((device) => {
            return (
              <MenuItem
                key={device.deviceId}
                onClick={() => changeVideoDevice(device.deviceId)}
              >
                <Flex alignItems="center">
                  {device.label}
                  {selectedVideoDeviceId === device.deviceId && (
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
