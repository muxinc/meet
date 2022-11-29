import React, { ReactNode, useCallback, useRef, useState } from "react";
import {
  ActiveSpeaker,
  LocalParticipant,
  RemoteParticipant,
  Space,
  SpaceEvent,
} from "@mux/spaces-web";

import { MAX_PARTICIPANTS_PER_PAGE } from "lib/constants";

import { MuxContext } from "./MuxContext";
import { DisplayMediaProvider } from "./DisplayMediaProvider";

type Props = {
  children: ReactNode;
};

export const SpaceProvider: React.FC<Props> = ({ children }) => {
  const spaceRef = useRef<Space | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [localParticipant, setLocalParticipant] =
    useState<LocalParticipant | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const joinSpace = useCallback(async (jwt: string) => {
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

    const handleActiveSpeakerChanged = (
      activeSpeakerChanges: ActiveSpeaker[]
    ) => {
      setParticipants((oldParticipantArray) => {
        const updatedParticipants = [...oldParticipantArray];

        activeSpeakerChanges.forEach((activeSpeaker: ActiveSpeaker) => {
          if (activeSpeaker.participant instanceof RemoteParticipant) {
            const participantIndex = updatedParticipants.findIndex(
              (p) => p.connectionId === activeSpeaker.participant.connectionId
            );

            if (participantIndex >= MAX_PARTICIPANTS_PER_PAGE - 1) {
              updatedParticipants.splice(participantIndex, 1);
              updatedParticipants.unshift(activeSpeaker.participant);
            }
          }
        });
        return updatedParticipants;
      });
    };

    const handleParticipantTrackSubscriptionChange = (
      participantWhoChanged: RemoteParticipant
    ) => {
      setParticipants((oldParticipantArray) => {
        const updatedSubscriptionParticipants = oldParticipantArray.map(
          (oldParticipant) =>
            oldParticipant.connectionId === participantWhoChanged.connectionId
              ? participantWhoChanged
              : oldParticipant
        );

        return [
          ...updatedSubscriptionParticipants.filter((p) => p.isSubscribed()),
          ...updatedSubscriptionParticipants.filter((p) => !p.isSubscribed()),
        ];
      });
    };

    const handleBroadcastStateChange = (broadcastState: boolean) => {
      setIsBroadcasting(broadcastState);
    };

    space.on(SpaceEvent.ParticipantJoined, handleParticipantJoined);
    space.on(SpaceEvent.ParticipantLeft, handleParticipantLeft);

    space.on(SpaceEvent.ActiveSpeakersChanged, handleActiveSpeakerChanged);
    space.on(SpaceEvent.BroadcastStateChanged, handleBroadcastStateChange);

    space.on(
      SpaceEvent.ParticipantTrackSubscribed,
      handleParticipantTrackSubscriptionChange
    );
    space.on(
      SpaceEvent.ParticipantTrackUnsubscribed,
      handleParticipantTrackSubscriptionChange
    );

    spaceRef.current = space;

    let _localParticipant;
    try {
      _localParticipant = await space.join();
      setLocalParticipant(_localParticipant);
      setIsBroadcasting(space.broadcasting);
      setIsJoined(true);
    } catch (error: any) {
      setJoinError(error.message);
      setIsBroadcasting(false);
      setIsJoined(false);
    }
    return _localParticipant;
  }, []);

  const leaveSpace = useCallback(() => {
    spaceRef.current?.removeAllListeners();
    spaceRef.current?.leave();
    setJoinError(null);
    setParticipants([]);
    setIsBroadcasting(false);
    setLocalParticipant(null);
    spaceRef.current = null;
    setIsJoined(false);
  }, []);

  return (
    <MuxContext.Provider
      value={{
        joinSpace,
        leaveSpace,
        space: spaceRef.current,
        participants,
        localParticipant,
        joinError,
        isJoined,
        isBroadcasting,
      }}
    >
      <DisplayMediaProvider>{children}</DisplayMediaProvider>
    </MuxContext.Provider>
  );
};
