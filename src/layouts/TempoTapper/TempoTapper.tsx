import "./TempoTapper.scss";
import useTempoTap, { metronomeTempi } from "../../hooks/useTempoTap";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { micActions } from "../../redux/micSlice";
import { useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import findNearestValue from "../../utils/findNearestValue";
import wrapValue from "../../utils/wrapValue";
import TextCarousel from "../../components/TextCarousel/TextCarousel";

const TempoTapper = ({ className }: { className?: string }) => {
  const { isRecording, tempo } = useAppSelector((state) => state.mic);
  const dispatch = useAppDispatch();
  const { tempo: tapperTempo, tapTempo, setTempo } = useTempoTap(tempo);
  const handlers = useSwipeable({
    onSwipedUp: () => {
      handleTempoSwipe(1);
    },
    onSwipedDown: () => {
      handleTempoSwipe(-1);
    },
    trackTouch: true,
    trackMouse: true,
  });

  function handleTempoSwipe(num: number) {
    const id = findNearestValue(metronomeTempi, tempo)[1];
    setTempo(metronomeTempi[wrapValue(id + num, metronomeTempi.length)]);
  }

  useEffect(() => {
    if (tapperTempo !== tempo) {
      dispatch(micActions.setTempo(tapperTempo));
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
      <div onClick={tapTempo} className="TempoTapper__tempo" {...handlers}>
        {tapperTempo}
      </div>
      <span className="TempoTapper__text">
        <div className="TempoTapper__text__slide">tap or swipe tempo</div>
      </span>
    </div>
  );
};

export default TempoTapper;
