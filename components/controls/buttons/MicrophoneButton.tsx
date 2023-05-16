import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { AiOutlineCheck } from "react-icons/ai";

import UserContext from "context/User";
import { useSpace } from "hooks/useSpace";
import { useUserMedia } from "hooks/useUserMedia";

import ChevronIcon from "components/icons/ChevronIcon";
import MuteMicrophoneIcon from "components/icons/MuteMicrophoneIcon";
import UnmuteMicrophoneIcon from "components/icons/UnmuteMicrophoneIcon";

export default function MicrophoneButton(): JSX.Element {
  const {
    userWantsMicMuted,
    setUserWantsMicMuted,
    microphoneDeviceId,
    setMicrophoneDeviceId,
  } = React.useContext(UserContext);
  const {
    microphoneDevices,
    muteActiveMicrophone,
    unMuteActiveMicrophone,
    getActiveMicrophoneLevel,
  } = useUserMedia();
  const { isJoined, publishMicrophone } = useSpace();
  const [temporaryUnmute, setTemporaryUnmute] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [micLevelPercent, setMicLevelPercent] = useState(0);
  const [micDistorted, setMicDistorted] = useState(false);

  const requestRef = React.useRef<number>();

  const selectAudioDevice = useCallback(
    async (deviceId: string) => {
      setMicrophoneDeviceId(deviceId);
      if (isJoined) {
        publishMicrophone(deviceId);
      }
    },
    [isJoined, setMicrophoneDeviceId, publishMicrophone]
  );

  const toggleMicrophone = useCallback(() => {
    if (userWantsMicMuted) {
      setUserWantsMicMuted(false);
      unMuteActiveMicrophone();
    } else {
      setUserWantsMicMuted(true);
      muteActiveMicrophone();
    }
  }, [
    userWantsMicMuted,
    setUserWantsMicMuted,
    muteActiveMicrophone,
    unMuteActiveMicrophone,
  ]);

  const animateMeter = useCallback(() => {
    if (requestRef.current != undefined && getActiveMicrophoneLevel) {
      let levels = getActiveMicrophoneLevel();

      if (levels) {
        // Convert to 0-100 scale
        let scaled = (Math.max(-60, levels.avgDb) + 60) * 1.66;
        setMicLevelPercent(scaled);

        if (levels.peakDb > -0.5) {
          setMicDistorted(true);
        } else {
          setMicDistorted(false);
        }
      } else {
        setMicLevelPercent(0);
        setMicDistorted(false);
      }
    }
    requestRef.current = requestAnimationFrame(animateMeter);
  }, [getActiveMicrophoneLevel]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateMeter);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animateMeter]);

  const hotkeyText = "⌘ + d"; // adding this here to make it easy to change later. appears in tooltip on button.
  useHotkeys(
    "meta+d",
    () => {
      toggleMicrophone();
    },
    { preventDefault: true },
    [toggleMicrophone]
  );

  useHotkeys(
    "space",
    () => {
      if (userWantsMicMuted && !temporaryUnmute) {
        unMuteActiveMicrophone();
        setTemporaryUnmute(true);
      }
    },
    { keydown: true, preventDefault: true },
    [unMuteActiveMicrophone, userWantsMicMuted, temporaryUnmute]
  );
  useHotkeys(
    "space",
    () => {
      if (temporaryUnmute) {
        setTemporaryUnmute(false);
        if (userWantsMicMuted) {
          muteActiveMicrophone();
        }
      }
    },
    { keyup: true, preventDefault: true },
    [muteActiveMicrophone, userWantsMicMuted, temporaryUnmute]
  );

  const ariaLabel = userWantsMicMuted ? "Unmute" : "Mute";

  return (
    <ButtonGroup position="relative">
      <Tooltip
        label={
          userWantsMicMuted ? `Unmute (${hotkeyText})` : `Mute (${hotkeyText})`
        }
      >
        <IconButton
          variant="control"
          aria-label={ariaLabel}
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          icon={
            userWantsMicMuted && !temporaryUnmute ? (
              <MuteMicrophoneIcon />
            ) : (
              <UnmuteMicrophoneIcon />
            )
          }
          onClick={toggleMicrophone}
          {...(isJoined &&
            (micDistorted
              ? {
                  background: `radial-gradient(50% 50% at 50% 50%, rgba(255, 92, 56, 0.75) 0%, rgba(255, 92, 56, 0) ${micLevelPercent}%)`,
                }
              : {
                  background: `radial-gradient(50% 50% at 50% 50%, rgba(27, 227, 73, 0.75) 0%, rgba(27, 227, 73, 0) ${micLevelPercent}%)`,
                }))}
        />
      </Tooltip>
      <Menu placement="top">
        {({ isOpen }) => (
          <>
            <MenuButton
              position="absolute"
              top="0px"
              right="0px"
              zIndex={100}
              as={IconButton}
              aria-label="Options"
              icon={<ChevronIcon />}
              variant="controlMenu"
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
                MICROPHONE
              </Text>
              {microphoneDevices.map((device: MediaDeviceInfo) => {
                return (
                  <MenuItem
                    key={device.deviceId}
                    onClick={() => selectAudioDevice(device.deviceId)}
                  >
                    <Flex alignItems="center">
                      {device.label}
                      {microphoneDeviceId == device.deviceId && (
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
      ;
    </ButtonGroup>
  );
}
