import React, { useState, useRef, useEffect } from "react";
import icons from "../../utils/icons";
import "./AudioPlayer.scss";
import Icon from "../Icon/Icon";
import cn from "classnames";
import formatTime from "../../utils/formatTime";
import { GenericRecording } from "../../types/audio";

type AudioPlayerProps = {
  className?: string;
  rec: GenericRecording;
  showTitle?: boolean;
  showGain?: boolean;
  defaultGain?: number;
  onGainChange?: (gain: number) => void;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ rec, className, onGainChange, defaultGain = 0.707, showTitle = true, showGain = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultGain);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!audio.paused);
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);
    if (audio) {
      audio.volume = newVolume;
    }
    setVolume(newVolume);
    if (onGainChange) {
      onGainChange(newVolume);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = defaultGain;
    }
  }, [defaultGain]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress = (currentTime / duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickedPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const clickedTime = (clickedPosition / progressBarWidth) * ((audioRef.current?.duration !== Infinity && audioRef.current?.duration) || 0);

    if (audioRef.current) {
      audioRef.current.currentTime = clickedTime;
    }
  };

  return (
    <div className={cn(className, "AudioPlayer")}>
      <audio ref={audioRef} src={rec.url} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
      <div className="AudioPlayer__playback">
        <Icon className="AudioPlayer__playback__toggle" icon={isPlaying ? icons.pause : icons.play} onClick={handlePlayPause} />
        <Icon className="AudioPlayer__playback__restart" icon={icons.restart} onClick={handleRestart} />
      </div>
      <div className="AudioPlayer__main-container">
        <span className="AudioPlayer__main-container__title">{showTitle && rec.name}</span>
        <div className="AudioPlayer__main-container__timeline">
          <div className="AudioPlayer__main-container__timeline__progress" onClick={handleProgressBarClick}>
            <div className="AudioPlayer__main-container__timeline__progress__inner" style={{ width: `${progress}%` }} />
          </div>
          <div className="AudioPlayer__main-container__timeline__duration">{formatTime(rec.duration)}</div>
          <div className="AudioPlayer__main-container__timeline__volume">
            {showGain && (
              <>
                <Icon
                  className="AudioPlayer__main-container__timeline__volume__icon"
                  icon={volume > 2 / 3 ? icons.volumeHigh : volume > 1 / 3 ? icons.volumeMid : volume > 0 ? icons.volumeLow : icons.volumeMute}
                />
                <input
                  className="AudioPlayer__main-container__timeline__volume__slider"
                  type="range"
                  id="volume"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </>
            )}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
