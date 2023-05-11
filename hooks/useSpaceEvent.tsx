import { SpaceEvent } from "@mux/spaces-web";
import SpaceContext from "context/Space";
import { useContext, useEffect, useRef } from "react";

/**
 * @param event
 * @param callback called whenever the event is fired. Warning: The callback should be provided using the `useCallback` hook to avoid this hook being called at every re-render of the component.
 */
export const useSpaceEvent = (
  event: SpaceEvent,
  callback: (...args: any) => void
): void => {
  const { space } = useContext(SpaceContext);

  useEffect(() => {
    if (space) {
      space.on(event, callback);
    } else {
      console.warn(
        `Unable to register useSpaceEvent callback ${callback.name} as the Space does not exist yet.`
      );
    }

    return () => {
      space?.off(event, callback);
    };
  }, [event, callback, space]);
};
