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
      responsive: "resize",
      oneSvgPerLine: true,
      scrollHorizontal: false,
      viewportHorizontal: false,
      viewportVertical: true,
      staffwidth: 450,
      scale: 0.9,
      wrap: {
        minSpacing: 1.7,
        maxSpacing: 4,
        preferredMeasuresPerLine: 2,
        minSpacingLimit: 1,
      },
    },
    {
      lineEndCallback: (...values) => {
        if (!values || !scoreRef.current) {
          return;
        }
        const position = values[0];
        const lineIndex = values[2].line;
        const width = scoreRef.current.children[0].children[lineIndex].clientWidth;
        const resizeFactor = (width / 450) * 0.9;
        scoreRef.current.scrollTo({ top: position.top * resizeFactor, behavior: "smooth" });
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
