import React, { useCallback, useEffect, useState } from "react";
import { Box, Fade, Flex, Image, useOutsideClick } from "@chakra-ui/react";
import {
  CreateLocalMediaOptions,
  LocalTrack,
  LocalTrackOptions,
  ParticipantEvent,
  TrackKind,
  TrackSource,
} from "@mux/spaces";
import { useLocalParticipant } from "hooks/useLocalParticipant";
import { AiOutlineCheck } from "react-icons/ai";

import ControlsButton from "../ControlsButton";

interface Props {
  hasPermissions: boolean;
}

export default function MicrophoneButton({
  hasPermissions,
}: Props): JSX.Element {
  const localParticipant = useLocalParticipant();
  const [isOpen, setIsOpen] = useState(false);

  const [microphoneTrack, setMicrophoneTrack] = useState(
    localParticipant
      ?.getAudioTracks()
      .find((track) => track.source === TrackSource.Microphone)
  );
  const [microphoneMuted, setMicrophoneMuted] = useState(
    microphoneTrack?.isMuted()
  );

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDeviceId, setAudioDeviceId] = useState("");

  useEffect(() => {
    async function loadDevices() {
      const availableDevices = await navigator.mediaDevices.enumerateDevices();
      const storedAudioDeviceId = localStorage.getItem("audioDeviceId");
      if (storedAudioDeviceId) {
        const availableAudioDeviceId = availableDevices.find(
          (availableDevice) => {
            return (
              availableDevice.kind === "audioinput" &&
              availableDevice.deviceId === storedAudioDeviceId
            );
          }
        );
        if (availableAudioDeviceId) {
          setAudioDeviceId(availableAudioDeviceId.deviceId);
        }
      }

      setDevices(availableDevices);
    }
    loadDevices();
  }, [hasPermissions]);

  const handleDeviceChange = useCallback(
    (trackKind: TrackKind, newDeviceId: string) => {
      let options: CreateLocalMediaOptions = {};
      if (newDeviceId !== "") {
        const option: LocalTrackOptions = {
          constraints: {
            deviceId: { exact: newDeviceId },
          },
        };
        switch (trackKind) {
          case TrackKind.Audio:
            options["audio"] = option;
            break;
          case TrackKind.Video:
            options["video"] = option;
            break;
        }
      }

      localParticipant?.getUserMedia(options).then((tracks) => {
        const updatedTracks = localParticipant.updateTracks(tracks);
        updatedTracks.forEach((track) => {
          switch (track.kind) {
            case TrackKind.Audio:
              setAudioDeviceId(newDeviceId);
              localStorage.setItem("audioDeviceId", newDeviceId);
              break;
          }
        });
      });
    },
    [localParticipant]
  );

  useEffect(() => {
    // Ensure mic/camera track state is initialized
    setMicrophoneTrack(
      localParticipant
        ?.getAudioTracks()
        .find((track) => track.source === TrackSource.Microphone)
    );

    // Keep mic/camera state up-to-date when local tracks are published
    const handleTrackPublished = (track: LocalTrack) => {
      switch (track.source) {
        case TrackSource.Microphone:
          setMicrophoneTrack(track);
          break;
      }
    };

    localParticipant?.on(ParticipantEvent.TrackPublished, handleTrackPublished);

    return () => {
      localParticipant?.off(
        ParticipantEvent.TrackPublished,
        handleTrackPublished
      );
    };
  }, [localParticipant]);

  let micMute = (
    <Image alt="mute mic" width="25px" height="25px" src="/microphoneOff.svg" />
  );

  let micUnmute = (
    <Image
      alt="unmute mic"
      width="25px"
      height="25px"
      src="/microphoneOn.svg"
    />
  );

  let ref = React.useRef<any>();
  const ariaLabel = microphoneMuted ? "Unmute" : "Mute";
  useOutsideClick({
    ref: ref,
    enabled: isOpen,
    handler: (e) => {
      let icon = e.target as HTMLImageElement;
      // If the icon expand is toggled we need to ignore it so it doesn't reopen
      if (
        isOpen &&
        icon &&
        icon.classList &&
        icon.classList.contains(`iconExpand-${ariaLabel}`)
      )
        return;

      setIsOpen(!isOpen);
    },
  });

  return (
    <>
      <Fade in={isOpen}>
        <Flex
          bg="#383838"
          border="1px solid #323232"
          bottom="90px"
          color="#CCCCCC"
          display={isOpen ? "flex" : "none"}
          flexDirection="column"
          fontSize="14px"
          padding="5px 10px"
          position="absolute"
          ref={ref}
          width="300px"
        >
          <Box textAlign="left" paddingY="10px">
            MICROPHONE
          </Box>
          {devices
            .filter((d) => d.kind === "audioinput")
            .map((device) => {
              return (
                <Box
                  as="button"
                  key={device.deviceId}
                  onClick={() => {
                    handleDeviceChange(TrackKind.Audio, device.deviceId);
                  }}
                  textAlign="left"
                  paddingY="10px"
                >
                  <Flex alignItems="center">
                    {device.label}
                    {audioDeviceId == device.deviceId && (
                      <Box marginLeft="10px">
                        <AiOutlineCheck />
                      </Box>
                    )}
                  </Flex>
                </Box>
              );
            })}
        </Flex>
      </Fade>
      <ControlsButton
        icon={microphoneMuted ? micMute : micUnmute}
        aria-label={ariaLabel}
        toolTipLabel={microphoneMuted ? "Unmute" : "Mute"}
        onToggle={() => {
          if (!microphoneTrack) return;

          if (microphoneTrack.isMuted()) {
            microphoneTrack.unMute();
            setMicrophoneMuted(false);
          } else {
            microphoneTrack.mute();
            setMicrophoneMuted(true);
          }
        }}
        expandable={true}
        onToggleExpand={() => {
          setIsOpen(!isOpen);
        }}
      />
    </>
  );
}
