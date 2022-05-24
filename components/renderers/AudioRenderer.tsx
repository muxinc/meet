import { Track } from "@mux/spaces-web";
import { useEffect, useRef } from "react";

interface AudioTrackProps {
  track: Track;
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

    // The MediaStreamTrack needs to be observed rather than the Mux Track
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.track]);

  return <audio ref={audioEl} autoPlay playsInline />;
};

export default AudioRenderer;
