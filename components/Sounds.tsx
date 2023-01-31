import { useEffect } from "react";
import useSound from "use-sound";
import { SpaceEvent } from "@mux/spaces-web";

import { useSpace } from "hooks/useSpace";

export default function Sounds(): JSX.Element {
  const { onSpaceEvent } = useSpace();
  const [playJoinSound] = useSound("/sounds/meet-join.mp3");
  const [playLeaveSound] = useSound("/sounds/meet-leave.mp3");

  useEffect(() => {
    onSpaceEvent(SpaceEvent.ParticipantJoined, () => {
      if (document["hidden"]) {
        playJoinSound();
      }
    });

    onSpaceEvent(SpaceEvent.ParticipantLeft, () => {
      if (document["hidden"]) {
        playLeaveSound();
      }
    });
  }, [onSpaceEvent, playJoinSound, playLeaveSound]);

  return <></>;
}
