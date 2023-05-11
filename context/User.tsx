import React, { createContext, ReactNode, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useLocalStorage } from "../hooks/useLocalStorage";

interface UserState {
  id: string;
  participantName: string;
  setParticipantName: (newName: string) => string;
  interactionRequired: boolean;
  setInteractionRequired: (requiresInteraction: boolean) => void;
  userWantsMicMuted: boolean;
  setUserWantsMicMuted: (mute: boolean) => void;
  cameraOff: boolean;
  setCameraOff: (mute: boolean) => void;
  microphoneDeviceId: string;
  setMicrophoneDeviceId: (deviceId: string) => void;
  cameraDeviceId: string;
  setCameraDeviceId: (deviceId: string) => void;
  pinnedConnectionId: string;
  setPinnedConnectionId: (newConnectionId: string) => void;
}

const UserContext = createContext({} as UserState);

export default UserContext;

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [interactionRequired, setInteractionRequired] = useState(true);
  const [participantName, setParticipantName] = useLocalStorage(
    "participantName",
    ""
  );

  // This should never change unless we reload
  const id = uuidv4();

  const [userWantsMicMuted, setUserWantsMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const [microphoneDeviceId, setMicrophoneDeviceId] = useLocalStorage(
    "audioDeviceId",
    ""
  );
  const [cameraDeviceId, setCameraDeviceId] = useLocalStorage(
    "videoDeviceId",
    ""
  );
  const [pinnedConnectionId, setPinnedConnectionId] = useState("");

  const handleSetParticipantName = useCallback(
    (name: string) => {
      setParticipantName(name);
      return name;
    },
    [setParticipantName]
  );

  return (
    <UserContext.Provider
      value={{
        id,
        participantName,
        setParticipantName: handleSetParticipantName,
        interactionRequired,
        setInteractionRequired,
        userWantsMicMuted,
        setUserWantsMicMuted,
        cameraOff,
        setCameraOff,
        microphoneDeviceId,
        setMicrophoneDeviceId,
        cameraDeviceId,
        setCameraDeviceId,
        pinnedConnectionId,
        setPinnedConnectionId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
