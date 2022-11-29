import { createContext } from "react";
import { LocalParticipant, RemoteParticipant, Space } from "@mux/spaces-web";

interface IMuxContext {
  space: Space | null;
  joinSpace: (jwt: string) => Promise<LocalParticipant | undefined>;
  leaveSpace: () => void;
  localParticipant: LocalParticipant | null;
  participants: RemoteParticipant[];
  joinError: string | null;
  isJoined: boolean;
  isBroadcasting: boolean;
}

const defaultState = {
  space: null,
  joinSpace: (jwt: string) => Promise.resolve(undefined),
  leaveSpace: () => {},
  localParticipant: null,
  participants: [],
  joinError: null,
  isJoined: false,
  isBroadcasting: false,
};

export const MuxContext = createContext<IMuxContext>(defaultState);
