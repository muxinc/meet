import React, { useEffect, useRef } from "react";
import { Flex } from "@chakra-ui/react";

interface Props {
  attach: (element: HTMLVideoElement) => void;
}

export default function ScreenShareRenderer({ attach }: Props): JSX.Element {
  const videoEl = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoEl.current;
    if (!el) return;

    attach(el);
  }, [attach]);

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
