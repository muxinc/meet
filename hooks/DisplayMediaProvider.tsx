import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Track,
  RemoteParticipant,
  TrackSource,
  SpaceEvent,
  LocalTrack,
  LocalParticipant,
  getDisplayMedia,
} from "@mux/spaces-web";

import { useSpace } from "./useSpace";
import { useLocalParticipant } from "./useLocalParticipant";
import { DisplayMediaContext } from "./DisplayMediaContext";

type Props = {
  children: ReactNode;
};

export const DisplayMediaProvider: React.FC<Props> = ({ children }) => {
  const { space } = useSpace();
  const localParticipant = useLocalParticipant();
  const [screenShareTrack, setScreenShareTrack] = useState<Track>();
  const [screenShareError, setScreenShareError] = useState("");
  const [participantScreenSharing, setParticipantScreenSharing] = useState<
    LocalParticipant | RemoteParticipant | null
  >(null);

  const isLocalScreenShare = useMemo(() => {
    return participantScreenSharing instanceof LocalParticipant;
  }, [participantScreenSharing]);

  useEffect(() => {
    const handleScreenShareStarted = (
      participant: LocalParticipant | RemoteParticipant,
      track: Track
    ) => {
      if (track.source === TrackSource.Screenshare && track.hasMedia()) {
        setScreenShareTrack(track);
        setParticipantScreenSharing(participant);
      }
    };

    space?.on(SpaceEvent.ParticipantTrackPublished, handleScreenShareStarted);
    space?.on(SpaceEvent.ParticipantTrackSubscribed, handleScreenShareStarted);

    return () => {
      space?.off(
        SpaceEvent.ParticipantTrackPublished,
        handleScreenShareStarted
      );
      space?.off(
        SpaceEvent.ParticipantTrackSubscribed,
        handleScreenShareStarted
      );
    };
  }, [space]);

  useEffect(() => {
    const handleScreenShareEnded = (
      _participant: LocalParticipant | RemoteParticipant,
      track: Track
    ) => {
      if (track.source === TrackSource.Screenshare) {
        setScreenShareTrack(undefined);
        setParticipantScreenSharing(null);
      }
    };

    space?.on(SpaceEvent.ParticipantTrackUnpublished, handleScreenShareEnded);
    space?.on(SpaceEvent.ParticipantTrackUnsubscribed, handleScreenShareEnded);

    return () => {
      space?.off(
        SpaceEvent.ParticipantTrackUnpublished,
        handleScreenShareEnded
      );
      space?.off(
        SpaceEvent.ParticipantTrackUnsubscribed,
        handleScreenShareEnded
      );
    };
  }, [space]);

  const toggleScreenShare = useCallback(async () => {
    if (screenShareTrack) {
      // Shouldn't happen, but just to prevent a bug being added later
      if (!isLocalScreenShare || !(screenShareTrack instanceof LocalTrack)) {
        console.error(
          "Invalid state. Screen share toggled while someone else is sharing."
        );
        return;
      }

      // Stop screen share
      localParticipant?.unpublishTracks([screenShareTrack]);
    } else {
      // Start screen share
      try {
        const screenStreams = await getDisplayMedia({
          video: true,
          audio: false,
        });
        const screenStream = screenStreams?.find(
          (track) => track.source === "screenshare"
        );
        if (screenStream) {
          localParticipant?.publishTracks([screenStream]);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Permission denied") {
            // do nothing, they pressed cancel
          } else if (error.message === "Permission denied by system") {
            // chrome does not have permission to screen share
            setScreenShareError(error.message);
          } else {
            // unhandled exception
            console.error(error);
          }
        }
      }
    }
  }, [
    localParticipant,
    screenShareTrack,
    isLocalScreenShare,
    setScreenShareError,
  ]);

  return (
    <DisplayMediaContext.Provider
      value={{
        screenShareTrack,
        isLocalScreenShare,
        toggleScreenShare,
        screenShareError,
        participantScreenSharing,
      }}
    >
      {children}
    </DisplayMediaContext.Provider>
  );
};
