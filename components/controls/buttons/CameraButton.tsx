import React, { useCallback } from "react";
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { AiOutlineCheck } from "react-icons/ai";

import UserContext from "context/User";
import { useSpace } from "hooks/useSpace";
import { useUserMedia } from "hooks/useUserMedia";

import ChevronIcon from "components/icons/ChevronIcon";
import MuteCameraIcon from "components/icons/MuteCameraIcon";
import UnmuteCameraIcon from "components/icons/UnmuteCameraIcon";

export default function CameraButton(): JSX.Element {
  const { cameraOff, setCameraOff, cameraDeviceId, setCameraDeviceId } =
    React.useContext(UserContext);
  const { isJoined, publishCamera, unPublishDevice } = useSpace();
  const { cameraDevices, stopActiveCamera } = useUserMedia();

  const selectCameraDevice = useCallback(
    async (deviceId: string) => {
      setCameraDeviceId(deviceId);

      if (isJoined && !cameraOff) {
        publishCamera(deviceId);
      }
    },
    [isJoined, setCameraDeviceId, cameraOff, publishCamera]
  );

  const toggleCamera = useCallback(async () => {
    if (cameraOff) {
      setCameraOff(false);
      if (isJoined) {
        publishCamera(cameraDeviceId);
      }
    } else {
      setCameraOff(true);
      stopActiveCamera();
      if (isJoined) {
        unPublishDevice(cameraDeviceId);
      }
    }
  }, [
    isJoined,
    cameraOff,
    setCameraOff,
    cameraDeviceId,
    stopActiveCamera,
    publishCamera,
    unPublishDevice,
  ]);

  const hotkeyText = "⌘ + e"; // adding this here to make it easy to change later. appears in tooltip on button.
  useHotkeys(
    "meta+e",
    () => {
      toggleCamera();
    },
    { preventDefault: true },
    [toggleCamera]
  );

  const ariaLabel = cameraOff ? "Unhide" : "Hide";

  return (
    <ButtonGroup position="relative">
      <Tooltip
        label={
          cameraOff
            ? `Enable Video (${hotkeyText})`
            : `Disable Video (${hotkeyText})`
        }
      >
        <IconButton
          variant="control"
          aria-label={ariaLabel}
          icon={cameraOff ? <UnmuteCameraIcon /> : <MuteCameraIcon />}
          onClick={toggleCamera}
        />
      </Tooltip>
      <Menu placement="top">
        {({ isOpen }) => (
          <>
            <MenuButton
              position="absolute"
              top="0"
              right="0"
              as={IconButton}
              variant="controlMenu"
              aria-label="Options"
              icon={<ChevronIcon />}
              zIndex={100}
              minWidth="20px"
              {...(isOpen && { transform: "rotate(180deg)" })}
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
              {cameraDevices.map((device) => {
                return (
                  <MenuItem
                    key={device.deviceId}
                    onClick={() => selectCameraDevice(device.deviceId)}
                  >
                    <Flex alignItems="center">
                      {device.label}
                      {cameraDeviceId === device.deviceId && (
                        <Box marginLeft="10px">
                          <AiOutlineCheck />
                        </Box>
                      )}
                    </Flex>
                  </MenuItem>
                );
              })}
            </MenuList>
          </>
        )}
      </Menu>
    </ButtonGroup>
  );
}
