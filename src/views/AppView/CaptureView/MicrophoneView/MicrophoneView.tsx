import "./MicrophoneView.scss";
import useAudioRecorder from "../../../../hooks/useAudioRecorder";
import Icon from "../../../../components/Icon/Icon";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { push } from "../../../../redux/recordingsSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import getFormattedTimestamp from "../../../../utils/getFormattedTimestamp";
import TempoTapper from "../../../../layouts/TempoTapper/TempoTapper";
import { toggle } from "../../../../redux/micSlice";

const MicrophoneView = () => {
  const { startRecording, stopRecording, isRecording, audioBlob } = useAudioRecorder();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isRecording && audioBlob) {
      const rec = { name: `Untitled ${getFormattedTimestamp()}`, date: JSON.stringify(new Date()), url: URL.createObjectURL(audioBlob) };
      dispatch(push(rec));
      navigate("/app/playground/");
    }
  }, [isRecording]);

  return (
    <div className="MicrophoneView">
      <TempoTapper className="MicrophoneView__tapper" />
      <Icon
        className={cn("MicrophoneView__icon", { "--is-recording": isRecording })}
        icon={isRecording ? "svg-spinners:pulse-2" : "fluent:record-48-regular"}
        onClick={() => {
          dispatch(toggle());
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
      />
      <div />
    </div>
  );
};

export default MicrophoneView;
