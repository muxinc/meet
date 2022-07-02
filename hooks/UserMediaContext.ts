import { createContext } from "react";
import { LocalTrack } from "@mux/spaces-web";

export interface UserMediaState {
  audioDevices: MediaDeviceInfo[];
  audioMuted: boolean;
  audioTrack?: LocalTrack;
  selectedAudioDeviceId: string;
  changeAudioDevice: (deviceId: string) => void;

  videoDevices: MediaDeviceInfo[];
  videoOff: boolean;
  videoTrack?: LocalTrack;
  selectedVideoDeviceId: string;
  toggleVideo: () => void;
  changeVideoDevice: (deviceId: string) => void;

  getLocalMedia: () => void;
  userMediaError?: string;
}

export const UserMediaContext = createContext({} as UserMediaState);
