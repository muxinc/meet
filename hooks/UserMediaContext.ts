import { createContext } from "react";
import { LocalTrack } from "@mux/spaces-web";

export interface UserMediaState {
  userMediaError?: string;
  requestPermissionAndPopulateDevices: () => void;
  requestPermissionAndGetLocalMedia: (
    microphoneDeviceId?: string,
    cameraDeviceId?: string
  ) => Promise<LocalTrack[]>;

  activeMicrophone: LocalTrack | undefined;
  microphoneDevices: MediaDeviceInfo[];
  getMicrophoneDevice: (deviceId: string) => Promise<LocalTrack[]>;
  getActiveMicrophoneLevel: () => {
    avgDb: number;
    peakDb: number;
  } | null;

  activeCamera: LocalTrack | undefined;
  cameraDevices: MediaDeviceInfo[];
  getCameraDevice: (deviceId: string) => Promise<LocalTrack[]>;
}

export const UserMediaContext = createContext({} as UserMediaState);
