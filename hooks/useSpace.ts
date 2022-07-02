import { Space } from "@mux/spaces-web";
import { useContext } from "react";

import { MuxContext } from "./MuxContext";

/**
 * Returns an instance of space passed to or created by closest <SpaceProvider>.
 */
export const useSpace = (): {
  space: Space | null;
  joinError: string | null;
} => {
  const mux = useContext(MuxContext);

  return { space: mux?.space ?? null, joinError: mux?.joinError ?? null };
};
