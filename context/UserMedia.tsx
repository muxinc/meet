import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CreateLocalMediaOptions,
  getUserMedia,
  LocalTrack,
  TrackSource,
} from "@mux/spaces-web";

import UserContext from "./User";

import { defaultAudioConstraints } from "shared/defaults";

interface UserMediaState {
  activeCamera?: LocalTrack;
  activeMicrophone?: LocalTrack;

  userMediaError?: string;
  requestPermissionAndPopulateDevices: () => void;
  requestPermissionAndStartDevices: (
    microphoneDeviceId?: string,
    cameraDeviceId?: string
  ) => Promise<void>;

  getCamera: (deviceId: string) => Promise<LocalTrack>;
  cameraDevices: MediaDeviceInfo[];
  activeCameraId?: string;
  stopActiveCamera: () => void;
  changeActiveCamera: (deviceId: string) => Promise<void>;

  getMicrophone: (deviceId: string) => Promise<LocalTrack>;
  microphoneDevices: MediaDeviceInfo[];
  activeMicrophoneId?: string;
  muteActiveMicrophone: () => void;
  unMuteActiveMicrophone: () => void;
  changeActiveMicrophone: (deviceId: string) => Promise<void>;
  getActiveMicrophoneLevel: () => {
    avgDb: number;
    peakDb: number;
  } | null;
}

export const UserMediaContext = createContext({} as UserMediaState);

export default UserMediaContext;

const defaultCameraOption: CreateLocalMediaOptions = {
  video: {},
};

const defaultMicrophoneOption: CreateLocalMediaOptions = {
  audio: { constraints: defaultAudioConstraints },
};

const noCameraOption: CreateLocalMediaOptions = {
  video: false,
};

const noMicrophoneOption: CreateLocalMediaOptions = {
  audio: false,
};

const defaultMicrophoneCameraOptions: CreateLocalMediaOptions = {
  ...defaultCameraOption,
  ...defaultMicrophoneOption,
};

type Props = {
  children: ReactNode;
};

export const UserMediaProvider: React.FC<Props> = ({ children }) => {
  const {
    cameraDeviceId,
    setCameraDeviceId,
    microphoneDeviceId,
    setMicrophoneDeviceId,
    userWantsMicMuted,
  } = React.useContext(UserContext);
  const [microphoneDevices, setMicrophoneDevices] = useState<InputDeviceInfo[]>(
    []
  );
  const [activeMicrophone, setActiveMicrophone] = useState<LocalTrack>();
  const [cameraDevices, setCameraDevices] = useState<InputDeviceInfo[]>([]);
  const [activeCamera, setActiveCamera] = useState<LocalTrack>();
  const [localAudioAnalyser, setLocalAudioAnalyser] = useState<AnalyserNode>();
  const [userMediaError, setUserMediaError] = useState<string>();

  const activeCameraId = useMemo(() => {
    return activeCamera?.deviceId;
  }, [activeCamera]);

  const activeMicrophoneId = useMemo(() => {
    return activeMicrophone?.deviceId;
  }, [activeMicrophone]);

  const setupLocalMicrophoneAnalyser = useCallback((track: LocalTrack) => {
    let stream = new MediaStream([track.track]);

    const audioCtx = new AudioContext();
    const streamSource = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    streamSource.connect(analyser);
    analyser.fftSize = 2048;

    setLocalAudioAnalyser(analyser);
  }, []);

  const loadDevices = useCallback(async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices();

    const audioInputDevices = availableDevices.filter(
      (device) => device.kind === "audioinput"
    );
    setMicrophoneDevices(audioInputDevices);

    const videoInputDevices = availableDevices.filter(
      (device) => device.kind === "videoinput"
    );
    setCameraDevices(videoInputDevices);
  }, []);

  const requestPermissionAndPopulateDevices = useCallback(async () => {
    let tracks: LocalTrack[] = [];
    try {
      tracks = await getUserMedia({
        audio: { constraints: { deviceId: microphoneDeviceId } }, // loose constraint, will fail back if missing
        video: { constraints: { deviceId: cameraDeviceId } }, // loose constraint, will fail back if missing
      });
    } catch (e) {
      console.log("Failed to request default devices from your browser.");
    }

    try {
      tracks.forEach((track) => {
        if (track.deviceId) {
          if (track.source === TrackSource.Camera) {
            setCameraDeviceId(track.deviceId);
          } else if (track.source === TrackSource.Microphone) {
            setMicrophoneDeviceId(track.deviceId);
          }
        }
      });
    } catch (e) {
      console.log("Error thrown while stopping devices.");
    }

    await loadDevices();

    // Need to wait to stop the tracks until we've gotten the device list, or they'll have no labels
    tracks.forEach((track) => track.track.stop());
  }, [
    cameraDeviceId,
    loadDevices,
    microphoneDeviceId,
    setCameraDeviceId,
    setMicrophoneDeviceId,
  ]);

  const requestPermissionAndStartDevices = useCallback(
    async (microphoneDeviceId?: string, cameraDeviceId?: string) => {
      let options = { ...defaultMicrophoneCameraOptions };
      if (typeof microphoneDeviceId === "undefined") {
        options["audio"] = false;
      } else if (microphoneDeviceId !== "") {
        options["audio"] = {
          constraints: {
            deviceId: { exact: microphoneDeviceId },
            ...defaultAudioConstraints,
          },
        };
      }
      if (typeof cameraDeviceId === "undefined") {
        options["video"] = false;
      } else if (cameraDeviceId !== "") {
        options["video"] = {
          constraints: {
            deviceId: { exact: cameraDeviceId },
          },
        };
      }

      let tracks: LocalTrack[] = [];
      try {
        tracks = await getUserMedia(options);
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
          tracks = await getUserMedia({ audio: true, video: true });
        } else {
          setUserMediaError(e.name);
        }
      }

      tracks.forEach((track) => {
        switch (track.source) {
          case TrackSource.Microphone:
            setActiveMicrophone(track);
            setupLocalMicrophoneAnalyser(track);
            if (track.deviceId) {
              setMicrophoneDeviceId(track.deviceId);
            }
            if (userWantsMicMuted) {
              track.mute();
            }
            break;
          case TrackSource.Camera:
            setActiveCamera(track);
            if (track.deviceId) {
              setCameraDeviceId(track.deviceId);
            }
            break;
        }
      });

      await loadDevices();
    },
    [
      setupLocalMicrophoneAnalyser,
      setMicrophoneDeviceId,
      setCameraDeviceId,
      userWantsMicMuted,
    ]
  );

  const muteActiveMicrophone = useCallback(() => {
    try {
      activeMicrophone?.mute();
    } catch (error) {
      throw new Error("Select an active microphone before muting.");
    }
  }, [activeMicrophone]);

  const unMuteActiveMicrophone = useCallback(() => {
    try {
      activeMicrophone?.unMute();
    } catch (error) {
      throw new Error("Select an active microphone before muting.");
    }
  }, [activeMicrophone]);

  const getMicrophone = useCallback(
    async (deviceId: string) => {
      let options = {
        ...defaultMicrophoneOption,
        ...noCameraOption,
      };
      if (deviceId !== "") {
        options["audio"] = {
          constraints: {
            deviceId: { exact: deviceId },
            ...defaultAudioConstraints,
          },
        };
      }

      let tracks: LocalTrack[] = [];
      try {
        tracks = await getUserMedia(options);
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

      tracks.forEach((track) => {
        switch (track.source) {
          case TrackSource.Microphone:
            setActiveMicrophone(track);
            setupLocalMicrophoneAnalyser(track);
            if (track.deviceId) {
              setMicrophoneDeviceId(track.deviceId);
            }
            if (userWantsMicMuted) {
              track.mute();
            }
            break;
        }
      });

      return tracks[0];
    },
    [setupLocalMicrophoneAnalyser, setMicrophoneDeviceId, userWantsMicMuted]
  );

  const changeActiveMicrophone = useCallback(
    async (deviceId: string) => {
      await getMicrophone(deviceId);
    },
    [getMicrophone]
  );

  const getActiveMicrophoneLevel = useCallback(() => {
    if (!localAudioAnalyser) {
      return null;
    }

    const sampleBuffer = new Float32Array(localAudioAnalyser.fftSize);
    localAudioAnalyser.getFloatTimeDomainData(sampleBuffer);

    // Compute average power over the interval.
    let sumOfSquares = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      sumOfSquares += sampleBuffer[i] ** 2;
    }
    const avgPowerDecibels =
      10 * Math.log10(sumOfSquares / sampleBuffer.length);

    // Compute peak instantaneous power over the interval.
    let peakInstantaneousPower = 0;
    for (let i = 0; i < sampleBuffer.length; i++) {
      const power = sampleBuffer[i] ** 2;
      peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
    }
    const peakInstantaneousPowerDecibels =
      10 * Math.log10(peakInstantaneousPower);

    return {
      avgDb: avgPowerDecibels,
      peakDb: peakInstantaneousPowerDecibels,
    };
  }, [localAudioAnalyser]);

  const getCamera = useCallback(
    async (deviceId: string) => {
      let options = {
        ...defaultCameraOption,
        ...noMicrophoneOption,
      };
      if (deviceId !== "") {
        options["video"] = {
          constraints: {
            deviceId: { exact: deviceId },
          },
        };
      }

      let tracks: LocalTrack[] = [];
      try {
        tracks = await getUserMedia(options);
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

      tracks.forEach((track) => {
        switch (track.source) {
          case TrackSource.Camera:
            setActiveCamera(track);
            if (track.deviceId) {
              setCameraDeviceId(track.deviceId);
            }
            break;
        }
      });

      return tracks[0];
    },
    [setCameraDeviceId]
  );

  const changeActiveCamera = useCallback(
    async (deviceId: string) => {
      await getCamera(deviceId);
    },
    [getCamera]
  );

  const stopActiveCamera = useCallback(() => {
    if (activeCamera) {
      activeCamera.stop();
      setActiveCamera(undefined);
    }
  }, [activeCamera]);

  const onDeviceChange = useCallback(async () => {
    console.log("Detected device change, refreshing device list");
    await loadDevices();
  }, [loadDevices]);

  useEffect(() => {
    if (userWantsMicMuted && !activeMicrophone?.muted) {
      activeMicrophone?.mute();
    } else if (!userWantsMicMuted && activeMicrophone?.muted) {
      activeMicrophone?.unMute();
    }
  }, [userWantsMicMuted, activeMicrophone]);

  useEffect(() => {
    navigator.mediaDevices.addEventListener("devicechange", onDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        onDeviceChange
      );
    };
  }, [onDeviceChange]);

  return (
    <UserMediaContext.Provider
      value={{
        activeCamera,
        activeMicrophone,

        userMediaError,
        requestPermissionAndPopulateDevices,
        requestPermissionAndStartDevices,

        getCamera,
        cameraDevices,
        activeCameraId,
        stopActiveCamera,
        changeActiveCamera,

        getMicrophone,
        microphoneDevices,
        activeMicrophoneId,
        muteActiveMicrophone,
        unMuteActiveMicrophone,
        changeActiveMicrophone,
        getActiveMicrophoneLevel,
      }}
    >
      {children}
    </UserMediaContext.Provider>
  );
};
