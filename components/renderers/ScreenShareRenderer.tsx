import React, { useEffect, useRef } from "react";
import { Flex } from "@chakra-ui/react";

import { useScreenShare } from "hooks/useScreenShare";

export default function ScreenShareRenderer(): JSX.Element {
  const { screenShareTrack } = useScreenShare();
  const videoEl = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoEl.current;
    if (!el) return;

    el.muted = true;
    screenShareTrack?.attach(el);
    return () => {
      screenShareTrack?.detach(el);
    };
  }, [screenShareTrack]);

  return (
    <Flex
      height="100%"
      justifyContent="center"
      maxHeight="100%"
      maxWidth="100%"
      padding="10px"
      position="relative"
    >
      <video
        style={{ height: "100%", margin: "0px auto" }}
        ref={videoEl}
        autoPlay
        playsInline
      />
    </Flex>
  );
}
