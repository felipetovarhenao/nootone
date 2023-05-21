import "./AudioRecorder.scss";
import React, { useEffect } from "react";
import Icon from "../../components/Icon/Icon";
import cn from "classnames";
import useAudioRecorder from "../../hooks/useAudioRecorder";

interface AudioRecorderProps {
  handleBlob: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ handleBlob }) => {
  const { isRecording, stopRecording, startRecording, audioBlob } = useAudioRecorder();

  useEffect(() => {
    if (audioBlob) {
      handleBlob(audioBlob);
    }
  }, [audioBlob]);

  return (
    <Icon
      className={cn("AudioRecorder", { recording: isRecording })}
      onClick={isRecording ? stopRecording : startRecording}
      icon={isRecording ? "carbon:recording-filled" : "fad:armrecording"}
    />
  );
};

export default AudioRecorder;

// const AudioRecorder: React.FC<AudioRecorderProps> = ({handleBlob}) => {
//   const [audioURL, setAudioURL] = useState("");
//   const { isRecording, stopRecording, startRecording, audioBlob } = useAudioRecorder();
//   const [melody, setMelody] = useState<NoteEvent[]>([]);
//   const [harmony, setHarmony] = useState<NoteEvent[]>([]);

//   useEffect(() => {
//     if (audioBlob) {
//       const url = URL.createObjectURL(audioBlob);
//       blobUrlToAudioBuffer(url, (audioData, sampleRate) => {
//         const notes = detectPitch(audioData, sampleRate);
//         setMelody(notes);
//         const n = new NoteHarmonizer();
//         setHarmony(n.harmonize(notes, "upbeat"));
//         setAudioURL(url);
//       });
//     } else {
//       if (audioURL) {
//         URL.revokeObjectURL(audioURL);
//       }
//       setAudioURL("");
//     }
//   }, [audioBlob]);

//   return (
//     <div>
//       <h1>Auto-harmonizer</h1>
//       <Icon
//         className={cn("AudioRecorder", { recording: isRecording })}
//         onClick={isRecording ? stopRecording : startRecording}
//         icon={isRecording ? "carbon:recording-filled" : "fad:armrecording"}
//       />
//       {audioURL && (
//         <audio onPlay={() => playNotes(harmony)} controls>
//           <source src={audioURL} type="audio/webm" />
//         </audio>
//       )}
//     </div>
//   );
// };
