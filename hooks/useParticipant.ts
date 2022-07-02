import { useCallback, useEffect, useState } from "react";
import {
  LocalParticipant,
  ParticipantEvent,
  RemoteParticipant,
  Track,
  TrackSource,
} from "@mux/spaces-web";

export interface ParticipantState {
  isMuted: boolean;
  isSpeaking: boolean;
  isCameraOff: boolean;
  subscribedTracks: Track[];
}

export function useParticipant(
  participant: LocalParticipant | RemoteParticipant
): ParticipantState {
  const [isMuted, setMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [subscribedTracks, setSubscribedTracks] = useState<Track[]>([]);

  const onPublicationsChanged = useCallback(() => {
    const tracks: Track[] = [];
    participant.getAudioTracks().forEach((track) => {
      tracks.push(track);
    });
    participant.getVideoTracks().forEach((track) => {
      tracks.push(track);
    });
    setSubscribedTracks(tracks);
  }, [participant]);

  useEffect(() => {
    const onMuted = (track: Track) => {
      if (track.source == TrackSource.Microphone) {
        setMuted(true);
      } else if (track.source === TrackSource.Camera) {
        setIsCameraOff(true);
      }
    };
    const onUnmuted = (track: Track) => {
      if (track.source == TrackSource.Microphone) {
        setMuted(false);
      } else if (track.source === TrackSource.Camera) {
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
    participant.on(ParticipantEvent.TrackPublished, onPublicationsChanged);
    participant.on(ParticipantEvent.TrackUnpublished, onPublicationsChanged);
    participant.on(ParticipantEvent.TrackSubscribed, onPublicationsChanged);
    participant.on(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged);

    onPublicationsChanged();
    participant.getAudioTracks().forEach((track) => {
      if (track.source === TrackSource.Microphone) {
        setMuted(track.isMuted());
      }
    });
    participant.getVideoTracks().forEach((track) => {
      if (track.source === TrackSource.Camera) {
        setIsCameraOff(track.isMuted());
      }
    });

    return () => {
      participant.off(ParticipantEvent.TrackMuted, onMuted);
      participant.off(ParticipantEvent.TrackUnmuted, onUnmuted);
      participant.off(ParticipantEvent.StartedSpeaking, onSpeaking);
      participant.off(ParticipantEvent.StoppedSpeaking, stoppedSpeaking);
      participant.off(ParticipantEvent.TrackPublished, onPublicationsChanged);
      participant.off(ParticipantEvent.TrackUnpublished, onPublicationsChanged);
      participant.off(ParticipantEvent.TrackSubscribed, onPublicationsChanged);
      participant.off(
        ParticipantEvent.TrackUnsubscribed,
        onPublicationsChanged
      );
    };
  }, [participant, onPublicationsChanged]);

  return {
    isMuted,
    isSpeaking,
    isCameraOff,
    subscribedTracks,
  };
}
