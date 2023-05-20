import "./AudioRecorder.scss";
import React from "react";
import Icon from "../../components/Icon/Icon";
import cn from "classnames";
import useAudioRecorder from "../../hooks/useAudioRecorder";

const AudioRecorder: React.FC = () => {
  const { isRecording, stopRecording, startRecording, audioBlob } = useAudioRecorder();

  return (
    <>
      <Icon
        className={cn("AudioRecorder", { recording: isRecording })}
        onClick={isRecording ? stopRecording : startRecording}
        icon={isRecording ? "carbon:recording-filled" : "fad:armrecording"}
      />
      {audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
        </audio>
      )}
    </>
  );
};

export default AudioRecorder;
