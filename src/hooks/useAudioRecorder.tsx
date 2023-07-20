import { useRef, useState } from "react";
import { MicSettings } from "../redux/mic/micSlice";

type AudioRecorderHookResult = {
  startRecording: () => Promise<void>;
  stopRecording: (cancel?: boolean) => void;
  audioBlob: Blob | null;
  isRecording: boolean;
  recordingError: string;
  setMicSettings: (settings: MicSettings) => void;
};

const useAudioRecorder = (): AudioRecorderHookResult => {
  /* refs */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /* states */
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [micSettings, setMicSettings] = useState<MicSettings>({});

  /* handlers */
  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  const startRecording = async () => {
    if (navigator.mediaDevices?.getUserMedia) {
      setRecordingError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: true,
            ...micSettings,
          },
          video: false,
        });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
        setAudioBlob(null);
        setIsRecording(true);
        mediaRecorder.start(50);
      } catch (error) {
        setRecordingError(`${error}`);
      }
    } else {
      setRecordingError("Audio input is not supported by this browser.");
    }
  };

  const stopRecording = (cancel: boolean = false) => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.stop();
      if (!cancel) {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(blob);
      } else {
        setAudioBlob(null);
      }
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
    setMicSettings,
  };
};

export default useAudioRecorder;
