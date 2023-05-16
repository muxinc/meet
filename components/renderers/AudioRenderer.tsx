import { useEffect, useRef } from "react";

interface AudioTrackProps {
  attachFunc: (element: HTMLAudioElement) => void;
}

const AudioRenderer = ({ attachFunc }: AudioTrackProps) => {
  const audioEl = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioEl.current;
    if (!el) return;

    attachFunc(el);
  }, [attachFunc]);

  return <audio ref={audioEl} autoPlay />;
};

export default AudioRenderer;
