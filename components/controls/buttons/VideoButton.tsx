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

export default function VideoButton({ hasPermissions }: Props): JSX.Element {
  const localParticipant = useLocalParticipant();
  const [isOpen, setIsOpen] = useState(false);

  const [cameraTrack, setCameraTrack] = useState(
    localParticipant
      ?.getVideoTracks()
      .find((track) => track.source === TrackSource.Camera)
  );
  const [cameraMuted, setCameraMuted] = useState(cameraTrack?.isMuted());

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDeviceId, setVideoDeviceId] = useState("");

  useEffect(() => {
    async function loadDevices() {
      const availableDevices = await navigator.mediaDevices.enumerateDevices();
      const storedVideoDeviceId = localStorage.getItem("videoDeviceId");
      if (storedVideoDeviceId) {
        const availableVideoDeviceId = availableDevices.find(
          (availableDevice) => {
            return (
              availableDevice.kind === "videoinput" &&
              availableDevice.deviceId === storedVideoDeviceId
            );
          }
        );
        if (availableVideoDeviceId) {
          setVideoDeviceId(availableVideoDeviceId.deviceId);
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
          case TrackKind.Video:
            options["video"] = option;
            break;
        }
      }

      localParticipant?.getUserMedia(options).then((tracks) => {
        const updatedTracks = localParticipant.updateTracks(tracks);
        updatedTracks.forEach((track) => {
          switch (track.kind) {
            case TrackKind.Video:
              setVideoDeviceId(newDeviceId);
              localStorage.setItem("videoDeviceId", newDeviceId);
              break;
          }
        });
      });
    },
    [localParticipant]
  );

  useEffect(() => {
    setCameraTrack(
      localParticipant
        ?.getVideoTracks()
        .find((track) => track.source === TrackSource.Camera)
    );

    // Keep mic/camera state up-to-date when local tracks are published
    const handleTrackPublished = (track: LocalTrack) => {
      switch (track.source) {
        case TrackSource.Camera:
          setCameraTrack(track);
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

  const toggleVideo = useCallback(
    async (toggleOn) => {
      if (!toggleOn) {
        if (cameraTrack) {
          localStorage.setItem("videoDeviceId", cameraTrack.deviceId || "");
          cameraTrack.mute();
          cameraTrack.track.stop();
          setCameraTrack(undefined);
          setCameraMuted(true);
        }
      } else {
        // If a deviceId was stored, try to get local tracks for that device
        // Otherwise, fallback to browser defaults
        let tracks: LocalTrack[] | undefined = undefined;
        try {
          const storedVideoDeviceId = localStorage.getItem("videoDeviceId");
          if (storedVideoDeviceId) {
            tracks = await localParticipant?.getUserMedia({
              video: { constraints: { deviceId: storedVideoDeviceId } },
            });
          } else {
            tracks = await localParticipant?.getUserMedia({ video: {} });
          }
        } catch (e) {
          // May occur if previously saved device is no longer available
          if (e instanceof OverconstrainedError) {
            tracks = await localParticipant?.getUserMedia({ video: {} });
          }
        }

        if (tracks) {
          const updatedTracks = localParticipant?.updateTracks(tracks);
          if (updatedTracks) {
            const updatedCamera = updatedTracks.find((track) => {
              return track.source === TrackSource.Camera;
            });
            if (updatedCamera) {
              setCameraTrack(updatedCamera);
              setCameraMuted(false);
              updatedCamera.unMute();
            }
          }
        }
      }
    },
    [cameraTrack, localParticipant]
  );

  let cameraUnmute = (
    <Image
      alt="unmute camera"
      width="25px"
      height="25px"
      src="/cameraOff.svg"
    />
  );

  let cameraMute = (
    <Image alt="mute camera" width="25px" height="25px" src="/cameraOn.svg" />
  );

  let ref = React.useRef<any>();
  const ariaLabel = cameraMuted ? "Unhide" : "Hide";
  useOutsideClick({
    ref: ref,
    enabled: isOpen,
    handler: (e) => {
      let icon = e.target as HTMLImageElement;
      // If the icon expand is toggled we need to ignore it so it doesn't reopen
      if (
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
            CAMERA
          </Box>
          {devices
            .filter((d) => d.kind === "videoinput")
            .map((device) => {
              return (
                <Box
                  as="button"
                  key={device.deviceId}
                  onClick={() => {
                    handleDeviceChange(TrackKind.Video, device.deviceId);
                  }}
                  textAlign="left"
                  paddingY="10px"
                >
                  <Flex alignItems="center">
                    {device.label}
                    {videoDeviceId == device.deviceId && (
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
        icon={cameraMuted ? cameraUnmute : cameraMute}
        aria-label={ariaLabel}
        toolTipLabel={cameraMuted ? "Enable Video" : "Disable Video"}
        onToggle={() => {
          if (typeof cameraTrack === "undefined" || cameraTrack.isMuted()) {
            toggleVideo(true);
            setCameraMuted(false);
          } else {
            toggleVideo(false);
            setCameraMuted(true);
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
