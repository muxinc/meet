import React, { useEffect, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { Track } from "@mux/spaces-web";

interface Props {
  track?: Track;
}

export default function ScreenShareRenderer({ track }: Props): JSX.Element {
  const videoEl = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoEl.current;
    if (!el) return;

    track?.attach(el);

    return () => {
      track?.detach(el);
    };
  }, [track]);

  return (
    <Flex
      height="100%"
      justifyContent="center"
      maxHeight="100%"
      maxWidth="100%"
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
