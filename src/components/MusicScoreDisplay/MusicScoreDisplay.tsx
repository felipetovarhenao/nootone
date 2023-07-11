import "./MusicScoreDisplay.scss";
import { useEffect } from "react";
import { SymbolicMusicSequence } from "../../types/music";
import useMusicScore from "../../hooks/useMusicScore";
import WaveSurferPlayer from "../WaveSurferPlayer/WaveSurferPlayer";
import { GenericRecording } from "../../types/audio";

type MusicScoreDisplayProps = {
  musicSequence: SymbolicMusicSequence;
  recording: GenericRecording;
};
const MusicScoreDisplay = ({ musicSequence, recording }: MusicScoreDisplayProps) => {
  const { scoreRef, setMusicSequence, getTimingCallbacks } = useMusicScore(
    {
      selectionColor: "var(--txt-dark)",
      oneSvgPerLine: true,
      scrollHorizontal: false,
      viewportHorizontal: false,
      viewportVertical: true,
      staffwidth: 450,
      scale: 0.9,
      wrap: {
        minSpacing: 1.7,
        maxSpacing: 2.7,
        preferredMeasuresPerLine: 1,
        minSpacingLimit: 1,
      },
    },
    {
      beatCallback: (...beat) => {
        if (!beat || !scoreRef.current) {
          return;
        }
        const position = beat[3];
        scoreRef.current.scrollTo({ top: position.top, left: position.left, behavior: "smooth" });
      },
    }
  );

  useEffect(() => {
    setMusicSequence(musicSequence);
  }, [musicSequence]);

  function onPlay(currentTime: number) {
    getTimingCallbacks().start(currentTime, "seconds");
  }

  function onPause() {
    getTimingCallbacks().pause();
  }

  function onSeeking(currentTime: number) {
    getTimingCallbacks().setProgress(currentTime, "seconds");
  }

  return (
    <div className="MusicScoreDisplay">
      <div className="MusicScoreDisplay__score-container">
        <div className="MusicScoreDisplay__score-container__score" ref={scoreRef} />
      </div>
      <WaveSurferPlayer onSeeking={onSeeking} onPlay={onPlay} onPause={onPause} className="DevelopView__preview__player" rec={recording} />
    </div>
  );
};

export default MusicScoreDisplay;
