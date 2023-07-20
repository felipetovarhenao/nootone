import "./WaveSurferPlayer.scss";
import classNames from "classnames";
import { useRef, useState, useEffect, useCallback, RefObject } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import { Recording, RecordingVariation } from "../../types/audio";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import formatTime from "../../utils/formatTime";
import AudioPlayerOptions from "../../layouts/AudioPlayerOptions/AudioPlayerOptions";
import Tags from "../Tags/Tags";

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
  rec: Recording | RecordingVariation;
  showTitle?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showOptions?: boolean;
  onPlay?: (currentTime: number) => void;
  onPause?: () => void;
  onSeeking?: (currentTime: number) => void;
  onFinish?: () => void;
};

const WaveSurferPlayer = ({
  className,
  rec,
  onPlay,
  onPause,
  onSeeking,
  onFinish,
  showTitle = true,
  showDate = false,
  showTags = true,
  showOptions = true,
}: WaveSurferPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const wavesurfer = useWavesurfer(containerRef, {
    barWidth: 3,
    barGap: 3,
    barRadius: 100,
    duration: rec.duration,
    normalize: false,
    height: 40,
    progressColor: ["rgb(37,158,216)", "rgb(93,77,179)"],
    cursorColor: "rgb(37,158,216)",
    url: rec.url,
    renderFunction: !("roundRect" in CanvasRenderingContext2D.prototype)
      ? (peaks, ctx) => {
          const { width, height } = containerRef.current?.getBoundingClientRect() || { width: 500, height: 10 };
          peaks.forEach((peak) => {
            const skip = Math.floor(peak.length / 60);
            peak.slice(1).forEach((pt, i) => {
              if (i % skip !== 0) {
                return;
              }
              const peakValue = Math.abs(pt * height);
              ctx.fillRect((i / peak.length) * width * 2, height - peakValue, 5, peakValue * 2);
            });
          });
        }
      : undefined,
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

    const subscriptions = [
      wavesurfer.on("play", () => {
        if (onPlay) {
          onPlay(wavesurfer.getCurrentTime());
        }
        setIsPlaying(true);
      }),
      wavesurfer.on("pause", () => {
        if (onPause) {
          onPause();
        }
        setIsPlaying(false);
      }),
      wavesurfer.on("seeking", (currentTime: number) => {
        if (onSeeking) {
          onSeeking(currentTime);
        }
      }),
      wavesurfer.on("finish", () => {
        if (onFinish) {
          onFinish();
        }
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  return (
    <div className={classNames(className, "WaveSurferPlayer")}>
      <div className="WaveSurferPlayer__header">
        <span className="WaveSurferPlayer__header__date">{showDate && rec.date}</span>
        <span className="WaveSurferPlayer__header__title">{showTitle && rec.name}</span>
        {showTags && <Tags rec={rec} />}
      </div>
      <div className="WaveSurferPlayer__container">
        <div className="WaveSurferPlayer__playback">
          <Icon className="WaveSurferPlayer__playback__toggle" icon={isPlaying ? icons.pause : icons.play} onClick={onPlayClick} />
          <Icon className="WaveSurferPlayer__playback__restart" icon={icons.restart} onClick={() => wavesurfer?.seekTo(0)} />
        </div>
        <div className="WaveSurferPlayer__display">
          <div className="WaveSurferPlayer__display__waveform" ref={containerRef} style={{ width: "100%" }} />
          <div className="WaveSurferPlayer__display__duration">{formatTime(rec.duration)}</div>
        </div>
        {showOptions && <AudioPlayerOptions recording={rec} />}
      </div>
    </div>
  );
};

export default WaveSurferPlayer;
