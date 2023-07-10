import "./PrintableMusicScore.scss";
import { ReactNode, createContext, useContext, useRef, useState } from "react";
import useMusicScore from "../../hooks/useMusicScore";
import { SymbolicMusicSequence } from "../../types/music";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import { createPortal } from "react-dom";

type PrintableMusicScoreOptions = null | {
  musicSequence: SymbolicMusicSequence;
  recordingURL: string;
};

type PrintableMusicScoreContextType = (args: PrintableMusicScoreOptions) => void;

const PrintableMusicScoreContext = createContext<PrintableMusicScoreContextType | null>(null);

export const usePrintableMusicScore = () => {
  return useContext(PrintableMusicScoreContext) as PrintableMusicScoreContextType;
};

type PrintableMusiScoreProps = {
  children: ReactNode;
};

const PrintableMusiScoreProvider = ({ children }: PrintableMusiScoreProps) => {
  const { setMusicSequence, scoreRef, printScore } = useMusicScore();
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState("");

  function updateMusicSequence(scoreProps: PrintableMusicScoreOptions) {
    setIsOpen(scoreProps !== null);
    if (scoreProps) {
      setMusicSequence(scoreProps.musicSequence);
      setUrl(scoreProps.recordingURL);
    } else {
      setUrl("");
      setMusicSequence(null);
    }
  }

  function play() {
    audioRef.current?.play();
    setIsPlaying(true);
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }

  return (
    <PrintableMusicScoreContext.Provider value={updateMusicSequence}>
      {children}
      {createPortal(
        isOpen && (
          <div className="PrintableMusicScore__dialog">
            {url && <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />}
            <div className="PrintableMusicScore">
              <div className="PrintableMusicScore__buttons">
                <Icon
                  onClick={() => (isPlaying ? stop() : play())}
                  className="PrintableMusicScore__buttons__button --success"
                  icon={!isPlaying ? icons.play : icons.pause}
                />
                <Icon onClick={() => printScore()} className="PrintableMusicScore__buttons__button --caution" icon={icons.print} />
                <Icon onClick={() => updateMusicSequence(null)} className="PrintableMusicScore__buttons__button --danger" icon={icons.close} />
              </div>
              <div className="PrintableMusicScore__container">
                <div className="PrintableMusicScore__score" ref={scoreRef} />
              </div>
            </div>
          </div>
        ),
        document.getElementById("dialog") as HTMLElement
      )}
    </PrintableMusicScoreContext.Provider>
  );
};

export default PrintableMusiScoreProvider;
