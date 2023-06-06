import "./MicrophoneView.scss";
import useAudioRecorder from "../../../../hooks/useAudioRecorder";
import Icon from "../../../../components/Icon/Icon";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { push } from "../../../../redux/recordingsSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import getFormattedTimestamp from "../../../../utils/getFormattedTimestamp";
import TempoTapper from "../../../../layouts/TempoTapper/TempoTapper";
import { toggle } from "../../../../redux/micSlice";
import { useNotification } from "../../../../components/Notification/NotificationProvider";

const MicrophoneView = () => {
  const { startRecording, stopRecording, isRecording, audioBlob } = useAudioRecorder();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const [recTitle, setRecTitle] = useState("");

  useEffect(() => {
    if (!isRecording && audioBlob) {
      const rec = { name: recTitle || getFormattedTimestamp(), date: JSON.stringify(new Date()), url: URL.createObjectURL(audioBlob) };
      dispatch(push(rec));
      navigate("/app/playground/");
    }
  }, [isRecording]);

  return (
    <div className="MicrophoneView">
      <input
        disabled={isRecording}
        className="MicrophoneView__title"
        type="text"
        placeholder="title"
        value={recTitle}
        onChange={(e) => setRecTitle(e.target.value)}
      />
      <Icon
        className={cn("MicrophoneView__icon", { "--is-recording": isRecording })}
        icon={isRecording ? "svg-spinners:pulse-2" : "fluent:record-48-regular"}
        onClick={() => {
          if (navigator.mediaDevices?.getUserMedia!) {
            dispatch(toggle());
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          } else if (!isRecording) {
            notification({
              type: "ERROR",
              icon: "material-symbols:error",
              message: "Unable to record. Try using another a different browser, such as Google Chrome or Mozilla Firefox.",
            });
          }
        }}
      />
      <TempoTapper className="MicrophoneView__tapper" />
    </div>
  );
};

export default MicrophoneView;
