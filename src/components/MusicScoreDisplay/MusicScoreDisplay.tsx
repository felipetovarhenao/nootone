import "./MusicScoreDisplay.scss";
import { useEffect } from "react";
import { SymbolicMusicSequence } from "../../types/music";
import useMusicScore from "../../hooks/useMusicScore";
import WaveSurferPlayer from "../WaveSurferPlayer/WaveSurferPlayer";
import { RecordingVariation } from "../../types/audio";
import useAnalyticsEventTracker, { EventName } from "../../hooks/useAnalyticsEventTracker";

type MusicScoreDisplayProps = {
  musicSequence: SymbolicMusicSequence;
  recording: RecordingVariation;
};

const defaultStaffWidth = 600;

const MusicScoreDisplay = ({ musicSequence, recording }: MusicScoreDisplayProps) => {
  const { scoreRef, setMusicSequence, getTimingCallbacks, setCallbackOptions, setRenderingOptions } = useMusicScore();
  const eventTracker = useAnalyticsEventTracker();

  useEffect(() => {
    setCallbackOptions((prev) => ({
      ...prev,
      lineEndCallback: (...values) => {
        if (!values || !scoreRef.current) {
          return;
        }
        const position = values[0];
        if (!position) {
          return;
        }
        const lineIndex = values[2].line;
        const width = scoreRef.current.children[0].children[lineIndex].clientWidth;
        const resizeFactor = (width / defaultStaffWidth) * 0.975;
        scoreRef.current.scrollTo({ top: position.top * resizeFactor, behavior: "smooth" });
      },
    }));
    setRenderingOptions({
      selectionColor: "var(--txt-dark)",
      responsive: "resize",
      oneSvgPerLine: true,
      scrollHorizontal: false,
      add_classes: true,
      viewportHorizontal: false,
      viewportVertical: true,
      staffwidth: defaultStaffWidth,
      wrap: {
        minSpacing: 1.7,
        maxSpacing: 4,
        preferredMeasuresPerLine: 2,
        minSpacingLimit: 1,
      },
    });
  }, []);

  useEffect(() => {
    setMusicSequence(musicSequence);
  }, [musicSequence]);

  function onPlay(currentTime: number) {
    getTimingCallbacks().start(currentTime, "seconds");
    eventTracker(EventName.PLAY_VARIATION_RECORDING);
  }

  function onPause() {
    getTimingCallbacks().pause();
    eventTracker(EventName.PAUSE_VARIATION_RECORDING);
  }

  function onSeeking(currentTime: number) {
    getTimingCallbacks().setProgress(currentTime, "seconds");
  }

  return (
    <div className="MusicScoreDisplay">
      <div className="MusicScoreDisplay__score-container">
        <div className="MusicScoreDisplay__score-container__score" ref={scoreRef} />
      </div>
      <WaveSurferPlayer
        showTags={false}
        onSeeking={onSeeking}
        onPlay={onPlay}
        onPause={onPause}
        className="DevelopView__preview__player"
        rec={recording}
      />
    </div>
  );
};

export default MusicScoreDisplay;
