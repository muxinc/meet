import { useContext } from "react";

import UserMediaContext from "../context/UserMedia";

interface UserMedia {
  userMediaError?: string;
  requestPermissionAndPopulateDevices: () => void;
  requestPermissionAndStartDevices: (
    microphoneDeviceId?: string,
    cameraDeviceId?: string
  ) => Promise<void>;

  cameraDevices: MediaDeviceInfo[];
  activeCameraId?: string;
  stopActiveCamera: () => void;
  changeActiveCamera: (deviceId: string) => Promise<void>;

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

export function useUserMedia(): UserMedia {
  const {
    userMediaError,
    requestPermissionAndPopulateDevices,
    requestPermissionAndStartDevices,

    cameraDevices,
    activeCameraId,
    stopActiveCamera,
    changeActiveCamera,

    microphoneDevices,
    activeMicrophoneId,
    muteActiveMicrophone,
    unMuteActiveMicrophone,
    changeActiveMicrophone,
    getActiveMicrophoneLevel,
  } = useContext(UserMediaContext);

  return {
    userMediaError,
    requestPermissionAndPopulateDevices,
    requestPermissionAndStartDevices,

    cameraDevices,
    activeCameraId,
    stopActiveCamera,
    changeActiveCamera,

    microphoneDevices,
    activeMicrophoneId,
    muteActiveMicrophone,
    unMuteActiveMicrophone,
    changeActiveMicrophone,
    getActiveMicrophoneLevel,
  };
}
