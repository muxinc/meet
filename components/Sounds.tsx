import { useEffect } from "react";
import { SpaceEvent } from "@mux/spaces-web";
import useSound from "use-sound";

import { useSpace } from "hooks/useSpace";

export default function Sounds(): JSX.Element {
  const { space } = useSpace();
  const [playJoinSound] = useSound("/sounds/meet-join.mp3");
  const [playLeaveSound] = useSound("/sounds/meet-leave.mp3");

  useEffect(() => {
    if (!space) return;

    const handleParticipantJoined = () => {
      if (document["hidden"]) {
        playJoinSound();
      }
    };

    const handleParticipantLeft = () => {
      if (document["hidden"]) {
        playLeaveSound();
      }
    };

    space.on(SpaceEvent.ParticipantJoined, handleParticipantJoined);
    space.on(SpaceEvent.ParticipantLeft, handleParticipantLeft);

    return () => {
      space.off(SpaceEvent.ParticipantJoined, handleParticipantJoined);
      space.off(SpaceEvent.ParticipantLeft, handleParticipantLeft);
    };
  }, [space, playJoinSound, playLeaveSound]);

  return <></>;
}
