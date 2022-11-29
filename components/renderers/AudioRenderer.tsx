import { Track } from "@mux/spaces-web";
import { useEffect, useRef } from "react";

interface AudioTrackProps {
  track?: Track;
}

const AudioRenderer = ({ track }: AudioTrackProps) => {
  const audioEl = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioEl.current;
    if (!el) return;

    track?.attach(el);

    return () => {
      track?.detach(el);
    };
  }, [track]);

  return <audio ref={audioEl} autoPlay />;
};

export default AudioRenderer;
