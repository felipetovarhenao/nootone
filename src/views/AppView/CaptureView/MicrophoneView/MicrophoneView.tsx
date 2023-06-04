import "./MicrophoneView.scss";
import useAudioRecorder from "../../../../hooks/useAudioRecorder";
import Icon from "../../../../components/Icon/Icon";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { push } from "../../../../redux/recordingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

const MicrophoneView = () => {
  const { startRecording, stopRecording, isRecording, audioBlob } = useAudioRecorder();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const recs = useAppSelector((state) => state.recordings);

  useEffect(() => {
    if (!isRecording && audioBlob) {
      console.log(recs);
      const rec = { name: getTimestamp(), url: URL.createObjectURL(audioBlob) };
      dispatch(push(rec));
      navigate("/app/playground/");
    }
  }, [isRecording]);

  return (
    <div className="MicrophoneView">
      <Icon
        className={cn("MicrophoneView__icon", { "--is-recording": isRecording })}
        icon={isRecording ? "svg-spinners:pulse-2" : "fluent:record-48-regular"}
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
      />
    </div>
  );
};

function getTimestamp() {
  let date = new Date();
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString();
}

export default MicrophoneView;
