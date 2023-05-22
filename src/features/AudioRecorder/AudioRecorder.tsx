import "./AudioRecorder.scss";
import React, { useEffect } from "react";
import Icon from "../../components/Icon/Icon";
import cn from "classnames";
import useAudioRecorder from "../../hooks/useAudioRecorder";

interface AudioRecorderProps {
  handleBlob: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ handleBlob }) => {
  const { isRecording, stopRecording, startRecording, audioBlob, recordingError } = useAudioRecorder();

  useEffect(() => {
    if (audioBlob) {
      handleBlob(audioBlob);
    }
  }, [audioBlob]);

  return (
    <>
      <Icon
        className={cn("AudioRecorder", { recording: isRecording })}
        onClick={isRecording ? stopRecording : startRecording}
        icon={isRecording ? "carbon:recording-filled" : "fad:armrecording"}
      />
      {recordingError && <span>{recordingError}</span>}
    </>
  );
};

export default AudioRecorder;
