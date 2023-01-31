import { useEffect, useRef } from "react";

interface AudioTrackProps {
  attach: (element: HTMLAudioElement) => void;
}

const AudioRenderer = ({ attach }: AudioTrackProps) => {
  const audioEl = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioEl.current;
    if (!el) return;

    attach(el);
  }, [attach]);

  return <audio ref={audioEl} autoPlay />;
};

export default AudioRenderer;
