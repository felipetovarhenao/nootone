import "./MicrophoneView.scss";
import useAudioRecorder from "../../../../hooks/useAudioRecorder";
import Icon from "../../../../components/Icon/Icon";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import getFormattedTimestamp from "../../../../utils/getFormattedTimestamp";
import TempoTapper from "../../../../layouts/TempoTapper/TempoTapper";
import { micActions } from "../../../../redux/micSlice";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import getAudioDuration from "../../../../utils/getAudioDuration";
import createUniqueTitle from "../../../../utils/createUniqueTitle";
import TextCarousel from "../../../../components/TextCarousel/TextCarousel";
import Metronome from "../../../../components/Metronome/Metronome";
import encodeBlobAsWav from "../../../../utils/encodeBlobAsWav";

const inputSuggestions = ["capture your idea", "sing a tune", "hum a melody", "whistle a song", "make music!"];
const recordingPrompts = ["recording your idea", "press stop when you're ready"];

const MicrophoneView = () => {
  const { startRecording, stopRecording, isRecording, audioBlob } = useAudioRecorder();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const [recTitle, setRecTitle] = useState(createUniqueTitle());
  const tempo = useAppSelector((state) => state.mic.tempo);

  useEffect(() => {
    if (!isRecording && audioBlob) {
      getAudioDuration(audioBlob).then((duration) => {
        encodeBlobAsWav(audioBlob).then((blob) => {
          const rec = {
            url: URL.createObjectURL(blob),
            name: recTitle || getFormattedTimestamp(),
            duration: duration,
            features: {
              tempo: tempo,
            },
          };
          dispatch(recordingActions.addNew(rec));
          navigate("/app/play/recordings/0");
        });
      });
    }
  }, [isRecording]);

  return (
    <div className="MicrophoneView">
      <input
        disabled={isRecording}
        className="MicrophoneView__title"
        type="text"
        placeholder={"title"}
        value={recTitle}
        onChange={(e) => setRecTitle(e.target.value)}
      />
      <div className="MicrophoneView__center-container">
        <TextCarousel duration={2.5} className="MicrophoneView__prompt">
          {(isRecording ? recordingPrompts : inputSuggestions).map((txt, i) => (
            <span className="MicrophoneView__prompt__slide" key={i}>
              {txt}
            </span>
          ))}
        </TextCarousel>
        {!isRecording ? (
          <Icon
            className={cn("MicrophoneView__icon", { "--is-recording": isRecording })}
            icon={"fluent:record-48-regular"}
            onClick={() => {
              if (navigator.mediaDevices?.getUserMedia!) {
                dispatch(micActions.toggle());
                startRecording();
              } else if (!isRecording) {
                notification({
                  type: "ERROR",
                  icon: "material-symbols:error",
                  message: "Unable to record. Try using another a different browser, such as Google Chrome or Mozilla Firefox.",
                });
              }
            }}
          />
        ) : (
          <Metronome
            padding={30}
            className="MicrophoneView__icon"
            onClick={() => {
              dispatch(micActions.toggle());
              stopRecording();
            }}
            tempo={tempo}
            canvasDims={{ width: 130, height: 130 }}
          />
        )}
      </div>
      <TempoTapper className="MicrophoneView__tapper" />
    </div>
  );
};

export default MicrophoneView;
