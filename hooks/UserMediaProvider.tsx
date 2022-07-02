import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  LocalTrack,
  CreateLocalMediaOptions,
  TrackKind,
  ParticipantEvent,
  TrackSource,
} from "@mux/spaces-web";

import { defaultAudioConstraints } from "shared/defaults";

import { UserMediaContext } from "./UserMediaContext";
import { useLocalParticipant } from "./useLocalParticipant";

const defaultVideoOption: CreateLocalMediaOptions = {
  video: {},
};

const defaultAudioOption: CreateLocalMediaOptions = {
  audio: { constraints: defaultAudioConstraints },
};

const defaultAudioVideoOptions: CreateLocalMediaOptions = {
  ...defaultVideoOption,
  ...defaultAudioOption,
};

type Props = {
  children: ReactNode;
  defaultAudioDeviceId: string;
  defaultVideoDeviceId: string;
};

export const UserMediaProvider: React.FC<Props> = ({
  children,
  defaultAudioDeviceId,
  defaultVideoDeviceId,
}) => {
  const localParticipant = useLocalParticipant();
  const [audioDevices, setAudioDevices] = useState<InputDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<InputDeviceInfo[]>([]);
  const [userMediaError, setUserMediaError] = useState<string>();
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState(defaultAudioDeviceId);
  const [audioTrack, setAudioTrack] = useState<LocalTrack>();
  const [audioMuted, setAudioMuted] = useState(false);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState(defaultVideoDeviceId);
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [videoOff, setVideoOff] = useState(false);

  async function loadDevices() {
    const availableDevices = await navigator.mediaDevices.enumerateDevices();

    const audioInputDevices = availableDevices.filter(
      (device) => device.kind === "audioinput"
    );
    setAudioDevices(audioInputDevices);

    const videoInputDevices = availableDevices.filter(
      (device) => device.kind === "videoinput"
    );
    setVideoDevices(videoInputDevices);
  }

  const getLocalMedia = useCallback(async () => {
    let options = { ...defaultAudioVideoOptions };
    if (selectedAudioDeviceId !== "") {
      options["audio"] = {
        constraints: {
          deviceId: { exact: selectedAudioDeviceId },
          ...defaultAudioConstraints,
        },
      };
    }
    if (selectedVideoDeviceId !== "") {
      options["video"] = {
        constraints: {
          deviceId: { exact: selectedVideoDeviceId },
        },
      };
    }
    let tracks: LocalTrack[] | undefined = undefined;
    try {
      tracks = await localParticipant?.getUserMedia(options);
      await loadDevices();
    } catch (e: any) {
      if (
        e.name == "NotAllowedError" ||
        e.name == "PermissionDeniedError" ||
        e instanceof DOMException
      ) {
        // permission denied to camera
        setUserMediaError("NotAllowedError");
      } else if (
        e.name == "OverconstrainedError" ||
        e.name == "ConstraintNotSatisfiedError"
      ) {
        // May occur if previously set device IDs are no longer available
        tracks = await localParticipant?.getUserMedia(defaultAudioVideoOptions);
        await loadDevices();
      } else {
        setUserMediaError(e.name);
      }
    }
    if (tracks) {
      const publishedTracks = await localParticipant?.publishTracks(tracks);

      if (publishedTracks) {
        publishedTracks.forEach((publishedTrack) => {
          switch (publishedTrack.kind) {
            case TrackKind.Audio:
              setAudioTrack(publishedTrack);
              setSelectedAudioDeviceId(publishedTrack.deviceId ?? "");
              break;
            case TrackKind.Video:
              setVideoTrack(publishedTrack);
              setSelectedVideoDeviceId(publishedTrack.deviceId ?? "");
              break;
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, setSelectedAudioDeviceId, setSelectedVideoDeviceId]);

  // These callbacks should be the only place where setMicrophoneMuted is called
  const handleTrackMuted = (track: LocalTrack) => {
    switch (track.source) {
      case TrackSource.Microphone:
        setAudioMuted(true);
        break;
      case TrackSource.Camera:
        setVideoOff(true);
        break;
    }
  };

  const handleTrackUnmuted = (track: LocalTrack) => {
    switch (track.source) {
      case TrackSource.Microphone:
        setAudioMuted(false);
        break;
      case TrackSource.Camera:
        setVideoOff(false);
        break;
    }
  };

  useEffect(() => {
    if (!localParticipant) return;

    getLocalMedia();

    localParticipant?.on(ParticipantEvent.TrackMuted, handleTrackMuted);
    localParticipant?.on(ParticipantEvent.TrackUnmuted, handleTrackUnmuted);
    return () => {
      localParticipant?.off(ParticipantEvent.TrackMuted, handleTrackMuted);
      localParticipant?.off(ParticipantEvent.TrackUnmuted, handleTrackUnmuted);
    };
  }, [localParticipant, getLocalMedia]);

  const changeAudioDevice = useCallback(
    async (deviceId: string) => {
      let options = { ...defaultAudioOption };
      if (deviceId !== "") {
        options["audio"] = {
          constraints: {
            deviceId: { exact: deviceId },
            ...defaultAudioConstraints,
          },
        };
      }

      let tracks: LocalTrack[] | undefined = undefined;
      try {
        tracks = await localParticipant?.getUserMedia(options);
      } catch (e: any) {
        // May occur if previously set device IDs are no longer available
        if (
          e.name == "NotAllowedError" ||
          e.name == "PermissionDeniedError" ||
          e instanceof DOMException
        ) {
          // permission denied to camera
          setUserMediaError("NotAllowedError");
        } else if (
          e.name == "OverconstrainedError" ||
          e.name == "ConstraintNotSatisfiedError"
        ) {
          setUserMediaError("OverconstrainedError");
        } else {
          setUserMediaError(e.name);
        }
      }

      if (tracks) {
        const updatedTracks = localParticipant?.updateTracks(tracks);

        if (updatedTracks) {
          updatedTracks.forEach((updatedTrack) => {
            switch (updatedTrack.kind) {
              case TrackKind.Audio:
                setAudioTrack(updatedTrack);
                setSelectedAudioDeviceId(deviceId);
                break;
            }
          });
        }
      }
    },
    [localParticipant, setSelectedAudioDeviceId]
  );

  const changeVideoDevice = useCallback(
    async (deviceId: string) => {
      if (videoOff) {
        setSelectedVideoDeviceId(deviceId);
        return;
      }

      let options = { ...defaultVideoOption };
      if (deviceId !== "") {
        options["video"] = {
          constraints: {
            deviceId: { exact: deviceId },
          },
        };
      }

      let tracks: LocalTrack[] | undefined = undefined;
      try {
        tracks = await localParticipant?.getUserMedia(options);
      } catch (e: any) {
        // May occur if previously set device IDs are no longer available
        if (
          e.name == "NotAllowedError" ||
          e.name == "PermissionDeniedError" ||
          e instanceof DOMException
        ) {
          // permission denied to camera
          setUserMediaError("NotAllowedError");
        } else if (
          e.name == "OverconstrainedError" ||
          e.name == "ConstraintNotSatisfiedError"
        ) {
          setUserMediaError("OverconstrainedError");
        } else {
          setUserMediaError(e.name);
        }
      }

      if (tracks) {
        const updatedTracks = localParticipant?.updateTracks(tracks);

        if (updatedTracks) {
          updatedTracks.forEach((updatedTrack) => {
            switch (updatedTrack.kind) {
              case TrackKind.Video:
                if (videoTrack) {
                  videoTrack.track.stop();
                }
                setVideoTrack(updatedTrack);
                setSelectedVideoDeviceId(updatedTrack.deviceId ?? "");
                break;
            }
          });
        }
      }
    },
    [videoOff, videoTrack, localParticipant, setSelectedVideoDeviceId]
  );

  const enableVideo = useCallback(
    async (enable: boolean) => {
      if (!enable) {
        if (videoTrack) {
          setVideoOff(true);
          setSelectedVideoDeviceId(videoTrack.deviceId ?? "");
          videoTrack.mute();
          videoTrack.track.stop();
          setVideoTrack(undefined);
        }
      } else {
        setVideoOff(false);
        let options = { ...defaultVideoOption };
        if (selectedVideoDeviceId !== "") {
          options["video"] = {
            constraints: {
              deviceId: { exact: selectedVideoDeviceId },
            },
          };
        }
        // If a deviceId was stored, try to get local tracks for that device
        // Otherwise, fallback to browser defaults
        let tracks: LocalTrack[] | undefined = undefined;
        try {
          tracks = await localParticipant?.getUserMedia(options);
        } catch (e: any) {
          // May occur if previously saved device is no longer available
          if (
            e.name == "OverconstrainedError" ||
            e.name == "ConstraintNotSatisfiedError"
          ) {
            tracks = await localParticipant?.getUserMedia(defaultVideoOption);
          }
        }

        if (tracks) {
          const updatedTracks = localParticipant?.updateTracks(tracks);
          if (updatedTracks) {
            const updatedCamera = updatedTracks.find((track) => {
              return track.source === TrackSource.Camera;
            });
            if (updatedCamera) {
              setVideoTrack(updatedCamera);
              updatedCamera.unMute();
            }
          }
        }
      }
    },
    [
      videoTrack,
      localParticipant,
      selectedVideoDeviceId,
      setSelectedVideoDeviceId,
    ]
  );

  const toggleVideo = useCallback(async () => {
    if (!videoTrack) {
      enableVideo(true);
    } else {
      enableVideo(false);
    }
  }, [enableVideo, videoTrack]);

  return (
    <UserMediaContext.Provider
      value={{
        audioDevices,
        videoDevices,
        userMediaError,
        getLocalMedia,
        audioMuted,
        audioTrack,
        selectedAudioDeviceId,
        changeAudioDevice,
        selectedVideoDeviceId,
        videoOff,
        videoTrack,
        toggleVideo,
        changeVideoDevice,
      }}
    >
      {children}
    </UserMediaContext.Provider>
  );
};
