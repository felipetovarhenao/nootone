import "./AudioRecorder.scss";
import React, { useRef, useState } from "react";
import Icon from "../../components/Icon/Icon";
import cn from "classnames";

interface AudioRecorderProps {
  blobProcessor?: (audioBlob: Blob) => void;
}
const AudioRecorder: React.FC = ({ blobProcessor }: AudioRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = () => {
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
        mediaRecorder.start(50);
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.stop();
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm; codecs=opus" });
      if (blobProcessor) {
        blobProcessor(blob);
      }
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  return (
    <Icon
      className={cn("AudioRecorder", { recording: isRecording })}
      onClick={isRecording ? stopRecording : startRecording}
      icon={isRecording ? "carbon:recording-filled" : "fad:armrecording"}
    />
  );
};

export default AudioRecorder;
