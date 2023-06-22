import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { micActions } from "../../redux/micSlice";
import wrapValue from "../../utils/wrapValue";
import BigSettingLayout from "../BigSettingLayout/BigSettingLayout";

const pitchLabels: Record<number, string> = {
  0: "C",
  1: "C#",
  2: "D",
  3: "Eb",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "Ab",
  9: "A",
  10: "Bb",
  11: "B",
};
type ReferencePitchSettingLayoutProps = {
  className?: string;
  disabled?: boolean;
};
const ReferencePitchSettingLayout = ({ disabled, className }: ReferencePitchSettingLayoutProps) => {
  const dispatch = useAppDispatch();
  const { referencePitch } = useAppSelector((state) => state.mic);

  function handleSwipe(increment: number) {
    dispatch(micActions.setReferencePitch(wrapValue(referencePitch + increment, 12)));
  }

  return (
    <BigSettingLayout
      className={cn(className, "ReferencePitchSettingLayout")}
      unit="pitch"
      onSwipedDown={() => handleSwipe(-1)}
      onSwipedUp={() => handleSwipe(1)}
      label="swipe metronome tone &#8597;"
      disabled={disabled}
    >
      {pitchLabels[referencePitch % 12]}
    </BigSettingLayout>
  );
};

export default ReferencePitchSettingLayout;
