import { createContext } from "react";
import { LocalParticipant, RemoteParticipant, Track } from "@mux/spaces-web";

export interface DisplayMediaState {
  screenShareError: string;
  screenShareTrack?: Track;
  isLocalScreenShare: boolean;
  toggleScreenShare: () => void;
  participantScreenSharing: LocalParticipant | RemoteParticipant | null;
}

export const DisplayMediaContext = createContext({} as DisplayMediaState);
