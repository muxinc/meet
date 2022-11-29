import { RemoteParticipant } from "@mux/spaces-web";
import { useContext } from "react";

import { MuxContext } from "./MuxContext";

/**
 * Returns an array of participants passed to or created by closest <SpaceProvider>.
 */
export const useParticipants = (): RemoteParticipant[] => {
  const mux = useContext(MuxContext);

  return mux.participants;
};
