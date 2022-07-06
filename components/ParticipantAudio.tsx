import React from "react";
import { RemoteParticipant, TrackSource } from "@mux/spaces-web";

import { useParticipant } from "hooks/useParticipant";

import AudioRenderer from "./renderers/AudioRenderer";

interface Props {
  participant: RemoteParticipant;
}

const ParticipantAudio = ({ participant }: Props) => {
  const { subscribedTracks } = useParticipant(participant);

  const micTrack = subscribedTracks.find((audioTrack) => {
    return audioTrack.source === TrackSource.Microphone;
  });

  return <>{micTrack && <AudioRenderer track={micTrack} />}</>;
};

export default ParticipantAudio;
