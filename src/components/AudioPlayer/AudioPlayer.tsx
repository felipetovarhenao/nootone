import React, { useState, useRef } from "react";
import icons from "../../utils/icons";
import "./AudioPlayer.scss";
import Icon from "../Icon/Icon";
import cn from "classnames";
import formatTime from "../../utils/formatTime";
import { Recording } from "../../types/audio";

type AudioPlayerProps = {
  className?: string;
  rec: Recording | Omit<Recording, "variations">;
  showTitle?: boolean;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className, rec, showTitle = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.707);
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
  };

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
      <div className="AudioPlayer__bar">
        {showTitle && <h1 className="AudioPlayer__bar__title">{rec.name}</h1>}
        <div className="AudioPlayer__bar__progress" onClick={handleProgressBarClick}>
          <div className="AudioPlayer__bar__progress__inner" style={{ width: `${progress}%` }} />
        </div>
        <div className="AudioPlayer__bar__volume">
          <Icon
            className="AudioPlayer__bar__volume__icon"
            icon={volume > 2 / 3 ? icons.volumeHigh : volume > 1 / 3 ? icons.volumeMid : volume > 0 ? icons.volumeLow : icons.volumeMute}
          />
          <input
            className="AudioPlayer__bar__volume__slider"
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
      <div className="AudioPlayer__duration">{formatTime(rec.duration)}</div>
      <a download={true} target="_blank" rel="noreferrer" href={rec.url}>
        <Icon icon={icons.download} />
      </a>
    </div>
  );
};

export default AudioPlayer;
