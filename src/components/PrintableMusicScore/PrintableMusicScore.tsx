import "./PrintableMusicScore.scss";
import { ReactNode, createContext, useContext, useState } from "react";
import useMusicScore from "../../hooks/useMusicScore";
import { SymbolicMusicSequence } from "../../types/music";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import { createPortal } from "react-dom";

type PrintableMusicScoreContextType = (musicSequence: SymbolicMusicSequence | null) => void;

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

  function updateMusicSequence(musicSequence: SymbolicMusicSequence | null) {
    setIsOpen(musicSequence !== null);
    setMusicSequence(musicSequence);
  }

  return (
    <PrintableMusicScoreContext.Provider value={updateMusicSequence}>
      {children}
      {createPortal(
        isOpen && (
          <div className="PrintableMusicScore__dialog">
            <div className="PrintableMusicScore">
              <div className="PrintableMusicScore__buttons">
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
