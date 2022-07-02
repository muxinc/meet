import { createContext } from "react";
import { LocalParticipant, RemoteParticipant, Space } from "@mux/spaces-web";

interface Mux {
  space: Space | null;
  localParticipant: LocalParticipant | null;
  participants: RemoteParticipant[];
  joinError: string | null;
}

export const MuxContext = createContext<Mux | null>(null);
