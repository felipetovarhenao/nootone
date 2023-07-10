import "./PrintableMusiScore.scss";
import { useEffect } from "react";
import useMusicScore from "../../hooks/useMusicScore";
import { SymbolicMusicSequence } from "../../types/music";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import cn from "classnames";

type PrintableMusiScoreProps = {
  musicSequence: SymbolicMusicSequence;
  className?: string;
};
const PrintableMusiScore = ({ musicSequence, className }: PrintableMusiScoreProps) => {
  const { setMusicSequence, scoreRef, printScore } = useMusicScore();

  useEffect(() => {
    setMusicSequence(musicSequence);
  }, [musicSequence]);

  return (
    <div className={cn(className, "PrintableMusicScore")}>
      <div className="PrintableMusicScore__buttons">
        <Icon onClick={() => printScore()} className="PrintableMusicScore__buttons__button" icon={icons.print} />
      </div>
      <div className="PrintableMusicScore__container">
        <div className="PrintableMusicScore__score" ref={scoreRef} />
      </div>
    </div>
  );
};

export default PrintableMusiScore;
