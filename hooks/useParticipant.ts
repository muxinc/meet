import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  LocalParticipant,
  ParticipantEvent,
  RemoteParticipant,
  Track,
  TrackSource,
} from "@mux/spaces-web";

import SpaceContext from "../context/Space";

export interface Participant {
  id: string;
  isLocal: boolean;
  isSpeaking: boolean;
  isMicrophoneMuted: boolean;
  isCameraOff: boolean;
  cameraWidth: number;
  cameraHeight: number;
  attachCamera: (element: HTMLVideoElement) => void;
  attachMicrophone: (element: HTMLAudioElement) => void;
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
  const [isMicrophoneMuted, setMicrophoneMuted] = useState(false);

  const isCameraOff = useMemo(() => {
    return !!!cameraTrack;
  }, [cameraTrack]);

  const cameraDimensions = useMemo(() => {
    return { width: cameraTrack?.width || 0, height: cameraTrack?.height || 0 };
  }, [cameraTrack]);

  const attachCamera = useCallback(
    (element: HTMLVideoElement) => {
      cameraTrack?.attachedElements.forEach((attachedEl) =>
        cameraTrack.detach(attachedEl)
      );
      cameraTrack?.attach(element);
    },
    [cameraTrack]
  );

  const attachMicrophone = useCallback(
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
        }
        if (track.source === TrackSource.Microphone) {
          setMicrophoneTrack(track);
          if (track.isMuted()) {
            setMicrophoneMuted(true);
          }
        }
      }
    },
    [setCameraTrack, setMicrophoneTrack]
  );

  const handleTrackRemoved = useCallback(
    (track: Track) => {
      if (track.source === TrackSource.Camera) {
        setCameraTrack(undefined);
      }
      if (track.source === TrackSource.Microphone) {
        setMicrophoneTrack(undefined);
      }
    },
    [setCameraTrack, setMicrophoneTrack]
  );

  useEffect(() => {
    if (!participant) return;

    const onMuted = (track: Track) => {
      if (track.source == TrackSource.Microphone) {
        setMicrophoneMuted(true);
      }
    };
    const onUnmuted = (track: Track) => {
      if (track.source == TrackSource.Microphone) {
        setMicrophoneMuted(false);
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
    };
  }, [participant, handleTrackAdded, handleTrackRemoved]);

  return {
    id,
    isLocal,
    isSpeaking,
    isCameraOff,
    isMicrophoneMuted,
    cameraWidth: cameraDimensions.width,
    cameraHeight: cameraDimensions.height,
    attachCamera,
    attachMicrophone,
  };
}
