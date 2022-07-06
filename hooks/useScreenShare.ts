import { useContext } from "react";

import { DisplayMediaContext, DisplayMediaState } from "./DisplayMediaContext";

export function useScreenShare(): DisplayMediaState {
  const screenshare = useContext(DisplayMediaContext);

  return screenshare;
}
