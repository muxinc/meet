import { LocalParticipant, RemoteParticipant, Track } from "@mux/spaces-web";
import { createContext } from "react";

export interface DisplayMediaState {
  screenShareError: string;
  screenShareTrack: Track | null;
  isLocalScreenShare: boolean;
  toggleScreenShare: () => void;
  participantScreenSharing: LocalParticipant | RemoteParticipant | null;
}

export const DisplayMediaContext = createContext({} as DisplayMediaState);
