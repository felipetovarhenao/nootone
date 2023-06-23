import "./WaveSurferPlayer.scss";
import classNames from "classnames";
import { useRef, useState, useEffect, useCallback, RefObject } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import { GenericRecording } from "../../types/audio";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import formatTime from "../../utils/formatTime";

export const useWavesurfer = (containerRef: RefObject<HTMLDivElement | null>, options: Omit<WaveSurferOptions, "container">): WaveSurfer | null => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef || containerRef.current === null) {
      return;
    }

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options.url]);

  return wavesurfer;
};

type WaveSurferPlayerProps = {
  className?: string;
  rec: GenericRecording;
  showTitle?: boolean;
};

const WaveSurferPlayer = ({ className, rec, showTitle = true }: WaveSurferPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const wavesurfer = useWavesurfer(containerRef, {
    barWidth: 3,
    barGap: 3,
    barRadius: 100,
    duration: rec.duration,
    normalize: true,
    height: 40,
    progressColor: ["rgb(37,158,216)", "rgb(93,77,179)"],
    cursorColor: "rgb(37,158,216)",
    url: rec.url,
  });

  const onPlayClick = useCallback(() => {
    if (!wavesurfer) {
      return;
    }
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
  }, [wavesurfer]);

  useEffect(() => {
    if (!wavesurfer || !rec) {
      return;
    }

    setIsPlaying(false);

    const subscriptions = [wavesurfer.on("play", () => setIsPlaying(true)), wavesurfer.on("pause", () => setIsPlaying(false))];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  return (
    <div className={classNames(className, "WaveSurferPlayer")} style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>
      <span className="WaveSurferPlayer__title">{showTitle && rec.name}</span>
      <div className="WaveSurferPlayer__container">
        <div className="WaveSurferPlayer__playback">
          <Icon className="WaveSurferPlayer__playback__toggle" icon={isPlaying ? icons.pause : icons.play} onClick={onPlayClick} />
          <Icon className="WaveSurferPlayer__playback__restart" icon={icons.restart} onClick={() => wavesurfer?.seekTo(0)} />
        </div>
        <div className="WaveSurferPlayer__display">
          <div className="WaveSurferPlayer__display__waveform" ref={containerRef} style={{ width: "100%" }} />
          <div className="WaveSurferPlayer__display__duration">{formatTime(rec.duration)}</div>
        </div>
      </div>
    </div>
  );
};

export default WaveSurferPlayer;
