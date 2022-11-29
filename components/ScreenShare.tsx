import { Center } from "@chakra-ui/react";
import { Track } from "@mux/spaces-web";

import ScreenShareRenderer from "./renderers/ScreenShareRenderer";

interface Props {
  width: number;
  screenShareTrack?: Track;
}

export default function ScreenShare({
  width,
  screenShareTrack,
}: Props): JSX.Element {
  return (
    <Center width={`${width}px`} maxHeight="100%">
      <ScreenShareRenderer track={screenShareTrack} />
    </Center>
  );
}
