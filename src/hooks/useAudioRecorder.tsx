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
    if (navigator.mediaDevices?.getUserMedia) {
      setRecordingError("");
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: true,
            // autoGainControl: false,
            // noiseSuppression: false,
          },
          video: false,
        })
        .then((stream) => {
          setIsRecording(true);
          setAudioBlob(null);
          audioChunksRef.current = [];
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
          mediaRecorder.start(50);
        })
        .catch((error) => {
          setRecordingError(error);
        });
    } else {
      setRecordingError("Audio input is not supported by this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.stop();
      const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
      setAudioBlob(blob);
      setIsRecording(false);
      setRecordingError("");
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
