import { LocalParticipant, Space } from "@mux/spaces-web";
import { useContext } from "react";

import { MuxContext } from "./MuxContext";

/**
 * Returns an instance of space passed to or created by closest <SpaceProvider>.
 */
export const useSpace = (): {
  space: Space | null;
  joinSpace: (jwt: string) => Promise<LocalParticipant | undefined>;
  leaveSpace: () => void;
  joinError: string | null;
  isJoined: boolean;
  isBroadcasting: boolean;
} => {
  const mux = useContext(MuxContext);

  return {
    space: mux.space ?? null,
    joinSpace: mux.joinSpace,
    leaveSpace: mux.leaveSpace,
    joinError: mux.joinError ?? null,
    isJoined: mux.isJoined,
    isBroadcasting: mux.isBroadcasting,
  };
};
