import "./TempoTapper.scss";
import useTempoTap from "../../hooks/useTempoTap";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setTempo as setMicTempo } from "../../redux/micSlice";
import { useEffect } from "react";

const TempoTapper = ({ className }: { className?: string }) => {
  const { isRecording, tempo } = useAppSelector((state) => state.mic);
  const dispatch = useAppDispatch();
  const { tempo: tapperTempo, tapTempo } = useTempoTap(tempo);

  useEffect(() => {
    if (tapperTempo !== tempo) {
      dispatch(setMicTempo(tapperTempo));
    }
  }, [tapperTempo]);

  return (
    <div className={cn(className, "TempoTapper")}>
      <div
        className={"TempoTapper__blinker"}
        style={{
          animationDuration: `${60 / tempo}s`,
          animationPlayState: isRecording ? "running" : "paused",
        }}
      />
      <div onClick={tapTempo} className="TempoTapper__tempo">
        {tapperTempo}
      </div>
      <span className="TempoTapper__text">tap tempo</span>
    </div>
  );
};

export default TempoTapper;
