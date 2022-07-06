import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  LocalParticipant,
  RemoteParticipant,
  Space,
  SpaceEvent,
} from "@mux/spaces-web";

import { MuxContext } from "./MuxContext";
import { UserMediaProvider } from "./UserMediaProvider";
import { DisplayMediaProvider } from "./DisplayMediaProvider";

type Props = {
  jwt?: string;
  children: ReactNode;
  defaultAudioDeviceId?: string;
  defaultVideoDeviceId?: string;
};

export const SpaceProvider: React.FC<Props> = ({
  children,
  jwt,
  defaultAudioDeviceId = "",
  defaultVideoDeviceId = "",
}) => {
  const spaceRef = useRef<Space | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [localParticipant, setLocalParticipant] =
    useState<LocalParticipant | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) {
      return;
    }

    (window as any).MUX_SPACES_ENABLE_SIMULCAST = true;

    let space: Space;
    try {
      space = new Space(jwt);
    } catch (e: any) {
      setJoinError(e.message);
      return;
    }

    const handleParticipantJoined = (newParticipant: RemoteParticipant) => {
      setParticipants((oldParticipantArray) => {
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

    space
      .join()
      .then((_localParticipant: LocalParticipant) => {
        setLocalParticipant(_localParticipant);
      })
      .catch((error) => {
        setJoinError(error.message);
      });

    spaceRef.current = space;

    return () => {
      space.off(SpaceEvent.ParticipantJoined, handleParticipantJoined);
      space.off(SpaceEvent.ParticipantLeft, handleParticipantLeft);

      setParticipants([]);
      space.leave();
    };
  }, [jwt, setJoinError]);

  return (
    <MuxContext.Provider
      value={{
        space: spaceRef.current,
        participants,
        localParticipant,
        joinError,
      }}
    >
      <DisplayMediaProvider>
        <UserMediaProvider
          defaultAudioDeviceId={defaultAudioDeviceId}
          defaultVideoDeviceId={defaultVideoDeviceId}
        >
          {children}
        </UserMediaProvider>
      </DisplayMediaProvider>
    </MuxContext.Provider>
  );
};
