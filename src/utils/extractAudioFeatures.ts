import frequencyToPitch from "./frequencyToPitch";
import { PitchDetector } from "pitchy";
import createMedianFilter from "./createMedianFilter";
import extractNoteEvents from "./extractNoteEvents";
import getRMS from "./getRMS";
import { NoteEvent } from "../types/music";

type AudioFeatures = {
  hopSize: number;
  noteEvents: Omit<NoteEvent, "velocity">[];
  rms: Float32Array;
};

/**
 * Detects pitch and extracts note events from audio data.
 * @param audioData - The input audio data as a Float32Array.
 * @param sampleRate - The sample rate of the audio data.
 * @param hopSize - The hop size between frames. Default is 256.
 * @param frameLength - The length of each frame. Default is 2048.
 * @param filterSize - The size of the median filter. Default is 7.
 * @returns An array of note events extracted from the audio data.
 */
const extractAudioFeatures = (
  audioData: Float32Array,
  sampleRate: number,
  hopSize: number = 256,
  frameLength: number = 2048,
  filterSize: number = 7
): AudioFeatures => {
  // Create a pitch detector for the given frame length
  const detector = PitchDetector.forFloat32Array(frameLength);

  // Calculate the number of frames
  const numFrames = Math.floor((audioData.length - frameLength) / hopSize);

  // Create arrays to store the pitch and clarity values for each frame
  const pitchArray = new Float32Array(numFrames);
  const clarityArray = new Float32Array(numFrames);
  let rmsArray = new Float32Array(numFrames);
  let rmsMin = Infinity;
  let rmsMax = -Infinity;

  // Create median filters for pitch and clarity
  const pitchMedianFilter = createMedianFilter(filterSize);
  const clarityMedianFilter = createMedianFilter(filterSize);
  const rmsMedianFilter = createMedianFilter(filterSize);

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

    const rms = getRMS(frame);

    // Apply the median filter to smooth the pitch and clarity values
    pitchArray[i] = Math.round(pitchMedianFilter(pitch));
    clarityArray[i] = clarityMedianFilter(clarity);
    rmsArray[i] = rmsMedianFilter(rms);
    rmsMin = Math.min(rmsMin, rmsArray[i]);
    rmsMax = Math.max(rmsMax, rmsArray[i]);
  }

  const rmsRange = rmsMax - rmsMin;
  rmsArray = rmsArray.map((x) => {
    const y = (x - rmsMin) / rmsRange;
    return y * 0.5 + 0.5;
  });

  // Extract note events from the pitch and clarity arrays
  return { hopSize: hopSize, noteEvents: extractNoteEvents(pitchArray, clarityArray, hopSize / sampleRate), rms: rmsArray };
};

export default extractAudioFeatures;
