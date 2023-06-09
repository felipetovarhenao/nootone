import { useRef, useState } from "react";

export const metronomeTempi: number[] = [
  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132, 138, 144, 152, 160, 168,
  176,
];
const numTempi = metronomeTempi.length;

/**
 * Custom hook for tapping tempo.
 * @param initialTempo - The initial tempo value (default: 120).
 * @param bufferSize - The size of the tap buffer (default: 4).
 * @param sensitivity - The sensitivity factor for tempo calculation (default: 0.99).
 * @returns Object containing tempo value, function to set tempo, and function to tap tempo.
 */
const useTempoTap = (initialTempo: number = 120, bufferSize: number = 4, sensitivity: number = 0.99) => {
  const tapBuffer = useRef<number[]>([]);
  const [tempo, setTempo] = useState(initialTempo);

  /**
   * Function to tap the tempo.
   * It calculates the tempo based on the time intervals between taps.
   */
  function tapTempo() {
    let time = new Date().getTime();
    const len = tapBuffer.current.length;

    // Clear buffer if the last tap was too long ago (more than 4 seconds)
    if (len > 0 && time - tapBuffer.current[len - 1] > 4000) {
      tapBuffer.current = [];
    }

    tapBuffer.current.push(time);

    // Return if the buffer is not yet filled to the desired size
    if (tapBuffer.current.length < bufferSize) {
      return;
    }

    // Remove oldest tap if the buffer exceeds the desired size
    if (tapBuffer.current.length > bufferSize) {
      tapBuffer.current.shift();
    }

    // Calculate the average time interval between taps
    let deltaSum = 0;
    for (let i = 0; i < tapBuffer.current.length - 1; i++) {
      deltaSum += tapBuffer.current[i + 1] - tapBuffer.current[i];
    }

    // Calculate the new tempo based on sensitivity and previous tempo
    let newTempo = sensitivity * (60000 / (deltaSum / (bufferSize - 1))) + (1 - sensitivity) * tempo;

    // Round the tempo to the nearest integer
    newTempo = Math.round(newTempo);

    // Update the tempo state
    setTempo(Math.max(metronomeTempi[0], Math.min(metronomeTempi[numTempi - 1], newTempo)));
  }

  return {
    tempo,
    setTempo,
    tapTempo,
  };
};

export default useTempoTap;
