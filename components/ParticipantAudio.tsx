import React from "react";
import { RemoteParticipant } from "@mux/spaces-web";

import { useParticipant } from "hooks/useParticipant";

import AudioRenderer from "./renderers/AudioRenderer";

interface Props {
  participant: RemoteParticipant;
}

const ParticipantAudio = ({ participant }: Props) => {
  const { microphoneTrack } = useParticipant(participant);

  return <AudioRenderer track={microphoneTrack} />;
};

export default ParticipantAudio;
