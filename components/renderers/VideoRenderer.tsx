import React, { useEffect, useRef, useState } from "react";

import poster from "../../public/poster.jpg";
import posterFlipped from "../../public/poster-flipped.jpg";

interface Props {
  width: number;
  height: number;
  local: boolean;
  connectionId: string;
  attachFunc: (element: HTMLVideoElement) => void;
}

export default function VideoRenderer({
  width,
  height,
  local,
  connectionId,
  attachFunc,
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

    attachFunc(el);

    el.addEventListener("enterpictureinpicture", handleEnterPiP);
    el.addEventListener("leavepictureinpicture", handleLeavePiP);
    return () => {
      el.removeEventListener("enterpictureinpicture", handleEnterPiP);
      el.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, [attachFunc]);

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
        objectFit: height > width ? "contain" : "cover",
        transform: !disableFlip && local ? "scaleX(-1)" : "",
      }}
    />
  );
}
