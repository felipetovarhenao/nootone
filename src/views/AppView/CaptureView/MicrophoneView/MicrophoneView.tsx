import "./MicrophoneView.scss";
import useAudioRecorder from "../../../../hooks/useAudioRecorder";
import Icon from "../../../../components/Icon/Icon";
import cn from "classnames";
import { useNavigate } from "react-router-dom";

const MicrophoneView = () => {
  const { startRecording, stopRecording, isRecording } = useAudioRecorder();
  const navigate = useNavigate();

  return (
    <div className="MicrophoneView">
      <Icon
        className={cn("MicrophoneView__icon", { "--is-recording": isRecording })}
        icon={isRecording ? "svg-spinners:pulse-2" : "fluent:record-48-regular"}
        onClick={() => {
          if (isRecording) {
            stopRecording();
            navigate("/app/playground/");
          } else {
            startRecording();
          }
        }}
      />
    </div>
  );
};

export default MicrophoneView;
