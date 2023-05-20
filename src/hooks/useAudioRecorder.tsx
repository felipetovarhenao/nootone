import { useRef, useState } from "react";

type AudioRecorderHookResult = {
  startRecording: () => void;
  stopRecording: () => void;
  audioBlob: Blob | null;
  isRecording: boolean;
  recordingError: string;
};

const useAudioRecorder = (): AudioRecorderHookResult => {
  /* refs */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /* states */
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");

  /* handlers */
  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        setIsRecording(true);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
        mediaRecorder.start(50);
      })
      .catch((error) => {
        setRecordingError(error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.stop();
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm; codecs=opus" });
      setAudioBlob(blob);
      setIsRecording(false);

      /* reset recorded audio chunks */
      audioChunksRef.current = [];
    }
  };

  return {
    startRecording,
    stopRecording,
    audioBlob,
    isRecording,
    recordingError,
  };
};

export default useAudioRecorder;
