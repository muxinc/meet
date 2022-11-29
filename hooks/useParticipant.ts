import { useCallback, useEffect, useState } from "react";
import {
  LocalParticipant,
  ParticipantEvent,
  RemoteParticipant,
  Track,
  TrackSource,
} from "@mux/spaces-web";

export interface ParticipantState {
  isLocal: boolean;
  isSpeaking: boolean;
  cameraTrack?: Track;
  microphoneTrack?: Track;
  isMicrophoneMuted: boolean;
}

export function useParticipant(
  participant: LocalParticipant | RemoteParticipant
): ParticipantState {
  const isLocal = participant instanceof LocalParticipant;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraTrack, setCameraTrack] = useState<Track>();
  const [microphoneTrack, setMicrophoneTrack] = useState<Track>();
  const [isMicrophoneMuted, setMicrophoneMuted] = useState(false);

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
    isLocal,
    isSpeaking,
    cameraTrack,
    microphoneTrack,
    isMicrophoneMuted,
  };
}
