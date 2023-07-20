import "./TempoTapper.scss";
import useTempoTap, { metronomeTempi } from "../../hooks/useTempoTap";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { micActions } from "../../redux/mic/micSlice";
import { useEffect } from "react";
import findNearestValue from "../../utils/findNearestValue";
import wrapValue from "../../utils/wrapValue";
import BigSettingLayout from "../BigSettingLayout/BigSettingLayout";

const TempoTapper = ({ className }: { className?: string }) => {
  const { tempo } = useAppSelector((state) => state.mic);
  const dispatch = useAppDispatch();

  const { tempo: tapperTempo, tapTempo, setTempo } = useTempoTap(tempo);

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
    <BigSettingLayout
      className={cn(className, "TempoTapper")}
      onClick={tapTempo}
      label="tap or swipe &#8597;"
      onSwipedDown={() => handleTempoSwipe(-1)}
      onSwipedUp={() => handleTempoSwipe(1)}
      unit="bpm"
    >
      {tapperTempo}
    </BigSettingLayout>
  );
};

export default TempoTapper;
