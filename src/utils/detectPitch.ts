import frequencyToPitch from "./frequencyToPitch";
import { PitchDetector } from "pitchy";
import createMedianFilter from "./createMedianFilter";
import extractNoteEvents from "./extractNoteEvents";

/**
 * Detects pitch and extracts note events from audio data.
 * @param audioData - The input audio data as a Float32Array.
 * @param sampleRate - The sample rate of the audio data.
 * @param hopSize - The hop size between frames. Default is 256.
 * @param frameLength - The length of each frame. Default is 2048.
 * @param filterSize - The size of the median filter. Default is 7.
 * @returns An array of note events extracted from the audio data.
 */
const detectPitch = (audioData: Float32Array, sampleRate: number, hopSize: number = 256, frameLength: number = 2048, filterSize: number = 7) => {
  // Create a pitch detector for the given frame length
  const detector = PitchDetector.forFloat32Array(frameLength);

  // Calculate the number of frames
  const numFrames = Math.floor((audioData.length - frameLength) / hopSize);

  // Create arrays to store the pitch and clarity values for each frame
  const pitchArray = new Float32Array(numFrames);
  const clarityArray = new Float32Array(numFrames);

  // Create median filters for pitch and clarity
  const pitchMedianFilter = createMedianFilter(filterSize);
  const clarityMedianFilter = createMedianFilter(filterSize);

  // Process each frame
  for (let i = 0; i < numFrames; i++) {
    // Calculate the start index of the current frame
    const st = i * hopSize;

    // Extract the current frame from the audio data
    const frame = audioData.slice(st, st + frameLength);

    // Find the pitch and clarity of the current frame using the pitch detector
    const [frequency, clarity] = detector.findPitch(frame, sampleRate);

    // Convert the frequency to pitch
    const pitch = frequencyToPitch(frequency);

    // Apply the median filter to smooth the pitch and clarity values
    pitchArray[i] = Math.round(pitchMedianFilter(pitch));
    clarityArray[i] = clarityMedianFilter(clarity);
  }

  // Extract note events from the pitch and clarity arrays
  return extractNoteEvents(pitchArray, clarityArray, hopSize / sampleRate);
};

export default detectPitch;
