import BigSettingLayout from "../BigSettingLayout/BigSettingLayout";
import "./MicrophoneSettingsLayout.scss";
import cn from "classnames";
import { micActions } from "../../redux/micSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

type MicrophoneSettingsLayoutProps = {
  className?: string;
  disabled?: boolean;
};
const MicrophoneSettingsLayout = ({ className, disabled }: MicrophoneSettingsLayoutProps) => {
  const micSettings = useAppSelector((state) => state.mic.micSettings);
  const dispatch = useAppDispatch();

  function toggleNoiseSuppression() {
    dispatch(micActions.setMicSettings({ noiseSuppression: !micSettings.noiseSuppression }));
  }

  return (
    <BigSettingLayout
      className={cn(className, "MicrophoneSettingsLayout")}
      label="noise suppression &#8597;"
      onSwipedDown={toggleNoiseSuppression}
      onClick={toggleNoiseSuppression}
      onSwipedUp={toggleNoiseSuppression}
      disabled={disabled}
    >
      {micSettings.noiseSuppression ? "ON" : "OFF"}
    </BigSettingLayout>
  );
};

export default MicrophoneSettingsLayout;
