import React from "react";

import { useParticipant } from "hooks/useParticipant";

import AudioRenderer from "./renderers/AudioRenderer";

interface Props {
  connectionId: string;
}

const ParticipantAudio = ({ connectionId }: Props) => {
  const { isLocal, attachMicrophone } = useParticipant(connectionId);

  return !isLocal ? <AudioRenderer attach={attachMicrophone} /> : null;
};

export default ParticipantAudio;
