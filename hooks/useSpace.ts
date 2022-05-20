import { Space } from "@mux/spaces";
import { useContext } from "react";

import { MuxContext } from "./MuxContext";

/**
 * Returns an instance of space passed to or created by closest <SpaceProvider>.
 */
export const useSpace = (): Space | null => {
  const mux = useContext(MuxContext);

  return mux?.space ?? null;
};
