import React, { ReactNode, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useLocalStorage } from "../hooks/useLocalStorage";

interface IUserContext {
  spaceId: string;
  setSpaceId?: (id: string) => void;
  participantId: string;
  participantName: string;
  setParticipantName: (newName: string) => string;
  interactionRequired: boolean;
  setInteractionRequired: (requiresInteraction: boolean) => void;
  microphoneMuted: boolean;
  setMicrophoneMuted: (mute: boolean) => void;
  cameraOff: boolean;
  setCameraOff: (mute: boolean) => void;
  microphoneDeviceId: string;
  setMicrophoneDeviceId: (deviceId: string) => void;
  cameraDeviceId: string;
  setCameraDeviceId: (deviceId: string) => void;
  pinnedConnectionId: string;
  setPinnedConnectionId: (newConnectionId: string) => void;
}

const defaultState = {
  spaceId: "",
  participantId: "",
  participantName: "",
  setParticipantName: () => "",
  interactionRequired: true,
  setInteractionRequired: () => {},
  microphoneMuted: false,
  setMicrophoneMuted: () => {},
  cameraOff: false,
  setCameraOff: () => {},
  microphoneDeviceId: "",
  setMicrophoneDeviceId: () => {},
  cameraDeviceId: "",
  setCameraDeviceId: () => {},
  pinnedConnectionId: "",
  setPinnedConnectionId: () => {},
};

const UserContext = React.createContext<IUserContext>(defaultState);

export default UserContext;

function generateId(value: string) {
  return `${value}|${uuidv4()}`;
}

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [interactionRequired, setInteractionRequired] = useState(true);
  const [spaceId, setSpaceId] = useLocalStorage("spaceId", "");
  const [participantName, setParticipantName] = useLocalStorage(
    "participantName",
    ""
  );
  const [participantId, setParticipantId] = useState(
    generateId(participantName)
  );
  const [microphoneMuted, setMicrophoneMuted] = useState(false);
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
      const newId = generateId(name);
      setParticipantId(newId);
      return newId;
    },
    [setParticipantName]
  );

  return (
    <UserContext.Provider
      value={{
        spaceId,
        setSpaceId,
        participantId,
        participantName,
        setParticipantName: handleSetParticipantName,
        interactionRequired,
        setInteractionRequired,
        microphoneMuted,
        setMicrophoneMuted,
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
