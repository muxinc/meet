import useSound from "use-sound";
import { SpaceEvent } from "@mux/spaces-web";

import { useSpaceEvent } from "hooks/useSpaceEvent";
import { useCallback } from "react";
import { useSpace } from "hooks/useSpace";

const participantSoundCutoff = 5;

export default function Sounds(): JSX.Element {
  const { isJoined } = useSpace();

  return <>{isJoined && <JoinedSounds />}</>;
}

function JoinedSounds(): JSX.Element {
  const { participantCount } = useSpace();
  const [playJoinSound] = useSound("/sounds/meet-join.mp3");
  const [playLeaveSound] = useSound("/sounds/meet-leave.mp3");

  useSpaceEvent(
    SpaceEvent.ParticipantJoined,
    useCallback(() => {
      if (document["hidden"] && participantCount < participantSoundCutoff) {
        playJoinSound();
      }
    }, [playJoinSound, participantCount])
  );

  useSpaceEvent(
    SpaceEvent.ParticipantLeft,
    useCallback(() => {
      if (document["hidden"] && participantCount < participantSoundCutoff) {
        playLeaveSound();
      }
    }, [playLeaveSound, participantCount])
  );

  return <></>;
}
