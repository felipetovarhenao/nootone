import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import BigSettingLayout from "../BigSettingLayout/BigSettingLayout";
import { micActions } from "../../redux/mic/micSlice";
import { useState } from "react";
import wrapValue from "../../utils/wrapValue";

type CountdownSettingsLayoutProps = {
  className?: string;
  disabled?: boolean;
};

const countValues = [0, 2, 3, 4, 5, 6];
const CountdownSettingsLayout = ({ className, disabled }: CountdownSettingsLayoutProps) => {
  const { numCountBeats } = useAppSelector((state) => state.mic);
  const [countIndex, setCountIndex] = useState(countValues.indexOf(4) || 3);
  const dispatch = useAppDispatch();

  function handleBeatCountChange(increment: number) {
    const newIndex = wrapValue(countIndex + increment, countValues.length);
    setCountIndex(newIndex);
    dispatch(micActions.setNumCountBeats(countValues[newIndex]));
  }

  return (
    <BigSettingLayout
      className={cn(className, "BigSettingLayout")}
      label="swipe count in &#8597;"
      onSwipedDown={() => handleBeatCountChange(-1)}
      onSwipedUp={() => handleBeatCountChange(1)}
      unit="beats"
      disabled={disabled}
    >
      {numCountBeats === 0 ? "NO" : numCountBeats}
    </BigSettingLayout>
  );
};

export default CountdownSettingsLayout;
