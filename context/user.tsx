import React, { ReactNode, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useLocalStorage } from "../hooks/useLocalStorage";

interface IUserContext {
  spaceId: string;
  setSpaceId?: (id: string) => void;
  participantId: string;
  participantName: string;
  setParticipantName: (newName: string) => void;
  promptForName: boolean;
  setPromptForName?: (shouldPrompt: boolean) => void;
  interactionRequired: boolean;
  setInteractionRequired: (requiresInteraction: boolean) => void;
}

const defaultState = {
  spaceId: "",
  participantId: "",
  participantName: "",
  setParticipantName: () => {},
  promptForName: false,
  interactionRequired: true,
  setInteractionRequired: () => {},
};

const UserContext = React.createContext<IUserContext>(defaultState);

export default UserContext;

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [promptForName, setPromptForName] = useState(false);
  const [interactionRequired, setInteractionRequired] = useState(true);
  const [spaceId, setSpaceId] = useLocalStorage("spaceId", "");
  const [participantName, setParticipantName] = useLocalStorage(
    "participantName",
    ""
  );

  const participantId = useMemo(() => {
    return `${participantName}|${uuidv4()}`;
  }, [participantName]);

  return (
    <UserContext.Provider
      value={{
        spaceId,
        setSpaceId,
        participantId,
        participantName,
        setParticipantName,
        promptForName,
        setPromptForName,
        interactionRequired,
        setInteractionRequired,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
