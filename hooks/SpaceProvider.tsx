import React, { useEffect, useRef, useState } from "react";
import {
  LocalParticipant,
  RemoteParticipant,
  Space,
  SpaceEvent,
} from "@mux/spaces";

import { MuxContext } from "./MuxContext";

type Props = {
  jwt: string;
};

export const SpaceProvider: React.FC<Props> = ({ children, ...props }) => {
  const { jwt } = props;

  const spaceRef = useRef<Space | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [localParticipant, setLocalParticipant] =
    useState<LocalParticipant | null>(null);

  useEffect(() => {
    if (!jwt) {
      return;
    }

    const space = new Space(jwt);

    const handleParticipantJoined = (newParticipant: RemoteParticipant) => {
      setParticipants((oldParticipantArray) => {
        // Prevent duplicate participant object from being added
        const found = oldParticipantArray.find(
          (p) => p.connectionId === newParticipant.connectionId
        );
        if (!found) {
          return [...oldParticipantArray, newParticipant];
        }
        return oldParticipantArray;
      });
    };

    const handleParticipantLeft = (participantLeaving: RemoteParticipant) => {
      setParticipants((oldParticipantArray) =>
        oldParticipantArray.filter(
          (p) => p.connectionId !== participantLeaving.connectionId
        )
      );
    };

    space.on(SpaceEvent.ParticipantJoined, handleParticipantJoined);
    space.on(SpaceEvent.ParticipantLeft, handleParticipantLeft);

    space.join().then((localParticipant: LocalParticipant) => {
      setLocalParticipant(localParticipant);
    });

    spaceRef.current = space;

    return () => {
      space.off(SpaceEvent.ParticipantJoined, handleParticipantJoined);
      space.off(SpaceEvent.ParticipantLeft, handleParticipantLeft);

      setParticipants([]);
      space.leave();
    };
  }, [jwt]);

  return (
    <MuxContext.Provider
      value={{ space: spaceRef.current, participants, localParticipant }}
    >
      {children}
    </MuxContext.Provider>
  );
};
