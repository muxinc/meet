import React from "react";

import { useParticipant } from "hooks/useParticipant";

import AudioRenderer from "./renderers/AudioRenderer";

interface Props {
  connectionId: string;
}

const ParticipantAudio = ({ connectionId }: Props) => {
  const { isLocal, attachAudioElement } = useParticipant(connectionId);

  return !isLocal ? <AudioRenderer attachFunc={attachAudioElement} /> : null;
};

export default ParticipantAudio;
