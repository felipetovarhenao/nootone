import "./TempoTapper.scss";
import useTempoTap from "../../hooks/useTempoTap";
import cn from "classnames";

const TempoTapper = ({ className }: { className?: string }) => {
  const { tempo, tapTempo } = useTempoTap();

  return (
    <div className={cn(className, "TempoTapper")}>
      <span className="TempoTapper__text">tap tempo</span>
      <div onClick={tapTempo} className="TempoTapper__tempo">
        {tempo}
      </div>
    </div>
  );
};

export default TempoTapper;
