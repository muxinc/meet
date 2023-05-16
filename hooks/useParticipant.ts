import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LocalParticipant,
  LocalTrack,
  ParticipantEvent,
  RemoteParticipant,
  Track,
  TrackSource,
} from "@mux/spaces-web";

import SpaceContext from "../context/Space";
import UserContext from "../context/User";

export interface Participant {
  id: string;
  isLocal: boolean;
  isSpeaking: boolean;
  hasMicTrack: boolean;
  isMicTrackMuted: boolean;
  isCameraOff: boolean;
  cameraWidth: number;
  cameraHeight: number;
  displayName: string;
  attachVideoElement: (element: HTMLVideoElement) => void;
  attachAudioElement: (element: HTMLAudioElement) => void;
}

export function useParticipant(connectionId: string): Participant {
  const { localParticipant, remoteParticipants } = useContext(SpaceContext);
  let participant: LocalParticipant | RemoteParticipant | undefined =
    remoteParticipants.find((p) => p.connectionId === connectionId);
  if (
    !participant &&
    localParticipant &&
    localParticipant.connectionId === connectionId
  ) {
    participant = localParticipant;
  }

  if (typeof participant === "undefined") {
    throw new Error(`No participant found with connectionId: ${connectionId}`);
  }

  const id = useMemo(() => (participant ? participant.id : ""), [participant]);
  const isLocal = useMemo(
    () => participant instanceof LocalParticipant,
    [participant]
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraTrack, setCameraTrack] = useState<Track>();
  const [microphoneTrack, setMicrophoneTrack] = useState<Track>();
  const [isMicTrackMuted, setIsMicTrackMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [displayName, setDisplayName] = useState(participant.displayName);
  const { userWantsMicMuted } = React.useContext(UserContext);

  const hasMicTrack = useMemo(() => {
    return !!microphoneTrack;
  }, [microphoneTrack]);

  const cameraDimensions = useMemo(() => {
    return { width: cameraTrack?.width || 0, height: cameraTrack?.height || 0 };
  }, [cameraTrack]);

  const attachVideoElement = useCallback(
    (element: HTMLVideoElement) => {
      cameraTrack?.attachedElements.forEach((attachedEl) =>
        cameraTrack.detach(attachedEl)
      );
      cameraTrack?.attach(element);
    },
    [cameraTrack]
  );

  const attachAudioElement = useCallback(
    (element: HTMLAudioElement) => {
      microphoneTrack?.attachedElements.forEach((attachedEl) =>
        microphoneTrack.detach(attachedEl)
      );
      microphoneTrack?.attach(element);
    },
    [microphoneTrack]
  );

  const handleTrackAdded = useCallback(
    (track: Track) => {
      if (track.hasMedia()) {
        if (track.source === TrackSource.Camera) {
          setCameraTrack(track);
          setIsCameraOff(track.isMuted());
        }
        if (track.source === TrackSource.Microphone) {
          setMicrophoneTrack(track);
          if (isLocal && userWantsMicMuted) {
            (track as LocalTrack).mute();
          }
          if (track.isMuted()) {
            setIsMicTrackMuted(true);
          }
        }
      }
    },
    [setCameraTrack, setMicrophoneTrack]
  );

  const handleSetDisplayName = useCallback(() => {
    setDisplayName(participant ? participant.displayName : "");
  }, [setDisplayName]);

  const handleTrackRemoved = useCallback(
    (track: Track) => {
      if (track.source === TrackSource.Camera) {
        setCameraTrack(undefined);
        setIsCameraOff(true);
      }
      if (track.source === TrackSource.Microphone) {
        setMicrophoneTrack(undefined);
      }
    },
    [setCameraTrack, setMicrophoneTrack]
  );

  useEffect(() => {
    if (isLocal && microphoneTrack instanceof LocalTrack) {
      if (userWantsMicMuted && !microphoneTrack.muted) {
        microphoneTrack.mute();
      } else if (!userWantsMicMuted && microphoneTrack.muted) {
        microphoneTrack.unMute();
      }
    }
  }, [userWantsMicMuted, isLocal, microphoneTrack]);

  useEffect(() => {
    if (!participant) return;

    const onMuted = (track: Track) => {
      if (track.source == TrackSource.Microphone) {
        setIsMicTrackMuted(true);
      } else if (track.source == TrackSource.Camera) {
        setIsCameraOff(true);
      }
    };
    const onUnmuted = (track: Track) => {
      if (track.source == TrackSource.Microphone) {
        setIsMicTrackMuted(false);
      } else if (track.source == TrackSource.Camera) {
        setIsCameraOff(false);
      }
    };
    const onSpeaking = () => {
      setIsSpeaking(true);
    };
    const stoppedSpeaking = () => {
      setIsSpeaking(false);
    };

    participant.on(ParticipantEvent.TrackMuted, onMuted);
    participant.on(ParticipantEvent.TrackUnmuted, onUnmuted);
    participant.on(ParticipantEvent.StartedSpeaking, onSpeaking);
    participant.on(ParticipantEvent.StoppedSpeaking, stoppedSpeaking);
    participant.on(ParticipantEvent.TrackPublished, handleTrackAdded);
    participant.on(ParticipantEvent.TrackUnpublished, handleTrackRemoved);
    participant.on(ParticipantEvent.TrackSubscribed, handleTrackAdded);
    participant.on(ParticipantEvent.TrackUnsubscribed, handleTrackRemoved);
    participant.on(ParticipantEvent.DisplayNameChanged, handleSetDisplayName);

    participant.getAudioTracks().forEach((track) => {
      handleTrackAdded(track);
    });
    participant.getVideoTracks().forEach((track) => {
      handleTrackAdded(track);
    });

    return () => {
      if (!participant) return;

      participant.off(ParticipantEvent.TrackMuted, onMuted);
      participant.off(ParticipantEvent.TrackUnmuted, onUnmuted);
      participant.off(ParticipantEvent.StartedSpeaking, onSpeaking);
      participant.off(ParticipantEvent.StoppedSpeaking, stoppedSpeaking);
      participant.off(ParticipantEvent.TrackPublished, handleTrackAdded);
      participant.off(ParticipantEvent.TrackUnpublished, handleTrackRemoved);
      participant.off(ParticipantEvent.TrackSubscribed, handleTrackAdded);
      participant.off(ParticipantEvent.TrackUnsubscribed, handleTrackRemoved);
      participant.off(
        ParticipantEvent.DisplayNameChanged,
        handleSetDisplayName
      );
    };
  }, [participant, handleTrackAdded, handleTrackRemoved]);

  return {
    id,
    isLocal,
    isSpeaking,
    isCameraOff,
    hasMicTrack,
    isMicTrackMuted,
    cameraWidth: cameraDimensions.width,
    cameraHeight: cameraDimensions.height,
    displayName,
    attachVideoElement,
    attachAudioElement,
  };
}
