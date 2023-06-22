import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import BigSettingLayout from "../BigSettingLayout/BigSettingLayout";
import { micActions } from "../../redux/micSlice";

type CountdownSettingsLayoutProps = {
  className?: string;
};
const CountdownSettingsLayout = ({ className }: CountdownSettingsLayoutProps) => {
  const { numCountBeats } = useAppSelector((state) => state.mic);
  const dispatch = useAppDispatch();

  function handleBeatCountChange(increment: number) {
    if ((numCountBeats <= 2 && increment < 0) || (numCountBeats >= 6 && increment > 0)) {
      return;
    }
    dispatch(micActions.setNumCountBeats(numCountBeats + increment));
  }

  return (
    <BigSettingLayout
      className={cn(className, "BigSettingLayout")}
      label="swipe count in &#8597;"
      onSwipedDown={() => handleBeatCountChange(-1)}
      onSwipedUp={() => handleBeatCountChange(1)}
      unit="beats"
    >
      {numCountBeats}
    </BigSettingLayout>
  );
};

export default CountdownSettingsLayout;
