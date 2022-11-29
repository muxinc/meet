import React, { useEffect, useRef, useState } from "react";
import { Track } from "@mux/spaces-web";

import poster from "../../public/poster.jpg";
import posterFlipped from "../../public/poster-flipped.jpg";

interface Props {
  local: boolean;
  track?: Track;
  connectionId: string;
}

export default function VideoRenderer({
  local,
  track,
  connectionId,
}: Props): JSX.Element {
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const [disableFlip, setDisableFlip] = useState(false);

  const handleEnterPiP = () => {
    setDisableFlip(true);
  };

  const handleLeavePiP = () => {
    setDisableFlip(false);
  };

  useEffect(() => {
    const el = videoEl.current;
    if (!el) return;

    track?.attach(el);

    el.addEventListener("enterpictureinpicture", handleEnterPiP);
    el.addEventListener("leavepictureinpicture", handleLeavePiP);

    return () => {
      track?.detach(el);

      el.removeEventListener("enterpictureinpicture", handleEnterPiP);
      el.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, [track]);

  return (
    <video
      id={connectionId}
      poster={!disableFlip && local ? posterFlipped.src : poster.src}
      ref={videoEl}
      autoPlay
      playsInline
      style={{
        width: "100%",
        height: "100%",
        objectFit: track && track?.height > track?.width ? "contain" : "cover",
        transform: !disableFlip && local ? "scaleX(-1)" : "",
      }}
    />
  );
}
