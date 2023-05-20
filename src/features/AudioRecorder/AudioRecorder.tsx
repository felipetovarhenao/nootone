import "./AudioRecorder.scss";
import React, { useEffect, useState } from "react";
import Icon from "../../components/Icon/Icon";
import cn from "classnames";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import blobUrlToAudioBuffer from "../../utils/blobUrlToAudioBuffer";
import detectPitch from "../../utils/detectPitch";
import pitchToFrequency from "../../utils/PitchToFrequency";

interface Note {
  pitch: number;
  onset: number;
  duration: number;
}

function playNotes(notes: Note[]) {
  const audioContext = new AudioContext();

  notes.forEach((note) => {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = pitchToFrequency(note.pitch);

    const startTime = audioContext.currentTime + note.onset;
    const duration = Math.max(0.25, note.duration * 2);
    const attack = duration * 0.1;
    const release = duration * 0.5;
    const endTime = startTime + duration;

    const gainNode = audioContext.createGain();
    const maxGain = 0.5; // Adjust the maximum volume here

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + attack); // Attack time
    gainNode.gain.setValueAtTime(maxGain, startTime + release); // Release time
    gainNode.gain.linearRampToValueAtTime(0, endTime);

    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
}

const AudioRecorder: React.FC = () => {
  const [audioURL, setAudioURL] = useState("");
  const { isRecording, stopRecording, startRecording, audioBlob } = useAudioRecorder();

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      blobUrlToAudioBuffer(url, (audioData, sampleRate) => {
        const notes = detectPitch(audioData, sampleRate);
        playNotes(notes);
        console.log(notes);
        setAudioURL(url);
      });
    } else {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      setAudioURL("");
    }
  }, [audioBlob]);

  return (
    <>
      <h1>Pitch detection demo</h1>
      <Icon
        className={cn("AudioRecorder", { recording: isRecording })}
        onClick={isRecording ? stopRecording : startRecording}
        icon={isRecording ? "carbon:recording-filled" : "fad:armrecording"}
      />
      {audioURL && (
        <audio controls>
          <source src={audioURL} type="audio/webm" />
        </audio>
      )}
    </>
  );
};

export default AudioRecorder;
