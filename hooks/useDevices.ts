import { useContext } from "react";

import { UserMediaContext, UserMediaState } from "./UserMediaContext";

export function useDevices(): UserMediaState {
  const devices = useContext(UserMediaContext);

  return devices;
}
