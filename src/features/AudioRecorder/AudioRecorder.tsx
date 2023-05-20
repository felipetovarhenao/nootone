import "./AudioRecorder.scss";
import React, { useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon/Icon";
import cn from "classnames";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { PitchDetector } from "pitchy";
import blobUrlToAudioBuffer from "../../utils/blobUrlToAudioBuffer";

function playFrequencies(context: AudioContext, frequencies: Float32Array, amplitudes: Float32Array): void {
  const sampleRate = context.sampleRate;
  const duration = 256 / sampleRate; // Duration in seconds

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  frequencies.forEach((frequency, index) => {
    const marker = duration * index + context.currentTime;
    if (amplitudes[index] > 0.96) {
      oscillator.frequency.linearRampToValueAtTime(frequency, marker);
      gainNode.gain.linearRampToValueAtTime(amplitudes[index], marker);
    }
  });
  oscillator.start(context.currentTime);
  oscillator.stop(0.1 + context.currentTime + frequencies.length * duration);
}

const detectPitch = (audioData: Float32Array, sampleRate: number) => {
  const hopSize = 256;
  const frameLength = 1024;
  const detector = PitchDetector.forFloat32Array(frameLength);
  const numFrames = Math.floor((audioData.length - frameLength) / hopSize);
  const frequencies = new Float32Array(numFrames);
  const confidence = new Float32Array(numFrames);
  for (let i = 0; i < numFrames; i++) {
    const st = i * hopSize;
    const frame = audioData.slice(st, st + frameLength);
    const [pitch, clarity] = detector.findPitch(frame, sampleRate);
    frequencies[i] = pitch;
    confidence[i] = clarity;
  }
  return [frequencies, confidence];
};

const AudioRecorder: React.FC = () => {
  const [audioURL, setAudioURL] = useState("");
  const audioContext = useRef(new AudioContext());
  const { isRecording, stopRecording, startRecording, audioBlob } = useAudioRecorder();

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      blobUrlToAudioBuffer(url, (audioData, sampleRate) => {
        const [frequencies, amplitudes] = detectPitch(audioData, sampleRate);
        playFrequencies(audioContext.current, frequencies, amplitudes);
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
