import "./MusicScoreDisplay.scss";
import { useEffect } from "react";
import { SymbolicMusicSequence } from "../../types/music";
import useMusicScore from "../../hooks/useMusicScore";

type MusicScoreDisplayProps = {
  musicSequence: SymbolicMusicSequence;
};
const MusicScoreDisplay = ({ musicSequence }: MusicScoreDisplayProps) => {
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
    <div className="MusicScoreDisplay">
      <button
        onClick={() => {
          getTimingCallbacks().start(0, "seconds");
        }}
      >
        start
      </button>
      <button onClick={() => getTimingCallbacks().stop()}>stop</button>
      <div className="MusicScoreDisplay__score" ref={scoreRef} />
    </div>
  );
};

export default MusicScoreDisplay;
