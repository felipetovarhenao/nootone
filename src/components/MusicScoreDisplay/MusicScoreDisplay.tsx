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
    { print: false, staffwidth: 500, responsive: "resize" },
    {
      beatCallback: (beat) => {
        console.log(beat);
      },
    }
  );

  useEffect(() => {
    setMusicSequence(musicSequence);
  }, [musicSequence]);

  return (
    <div className="MusicScoreDisplay" style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <button
          onClick={() => {
            getTimingCallbacks().start(0, "seconds");
          }}
        >
          start
        </button>
        <button onClick={() => getTimingCallbacks().stop()}>stop</button>
      </div>
      <div className="MusicScoreDisplay__score" ref={scoreRef} />
      <WaveSurferPlayer className="DevelopView__preview__player" rec={recording} />
    </div>
  );
};

export default MusicScoreDisplay;
