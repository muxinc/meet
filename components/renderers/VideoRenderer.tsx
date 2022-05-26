import { AspectRatio } from "@chakra-ui/react";
import { Track } from "@mux/spaces-web";
import React, { useEffect, useRef } from "react";
import poster from "../../public/poster.jpg";
import posterFlipped from "../../public/poster-flipped.jpg";

interface Props {
  local: boolean;
  track: Track;
  connectionId: string;
}

export default function VideoRenderer({
  local,
  track,
  connectionId,
}: Props): JSX.Element {
  const videoEl = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoEl.current;
    if (!el) return;

    el.muted = true;
    track.attach(el);
    return () => {
      track.detach(el);
    };

    // The MediaStreamTrack prop needs to be observed rather than the Mux Track
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.track]);

  return (
    <AspectRatio ratio={16 / 9} height="100%">
      <video
        id={connectionId}
        poster={local ? posterFlipped.src : poster.src}
        ref={videoEl}
        autoPlay
        playsInline
        style={{
          transform: local ? "scaleX(-1)" : "",
        }}
      />
    </AspectRatio>
  );
}
