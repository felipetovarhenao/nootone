import { BasicPitch, noteFramesToTime, addPitchBendsToNoteEvents, outputToNotesPoly } from "@spotify/basic-pitch";
import { NoteEvent } from "./playNoteEvents";

/**
 * Converts audio to note events using the BasicPitch library.
 *
 * @param audioArray - Audio data as a Float32Array.
 * @param onSuccess - A callback function called when the conversion is successful. It receives an array of note events.
 * @param onError - An optional callback function called if an error occurs during the conversion.
 * @param onProgress - An optional callback function called to get progress percentage value.
 * @param options - Optional detection settings.
 * @returns A promise that resolves when the conversion is complete.
 */
export default async function audioToNoteEvents(
  audioArray: Float32Array,
  onSuccess: onSuccessCallback,
  onError?: onErrorCallback,
  onProgress?: onProgressCallback,
  options?: detectionSettings
): Promise<void> {
  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];

  try {
    // Instantiate the BasicPitch model
    const basicPitch = new BasicPitch("https://raw.githubusercontent.com/spotify/basic-pitch-ts/main/model/model.json");

    // Evaluate the model on the decoded audio data
    await basicPitch.evaluateModel(
      audioArray,
      (frame: number[][], onset: number[][], contour: number[][]) => {
        // Collect the frame, onset, and contour data
        frames.push(...frame);
        onsets.push(...onset);
        contours.push(...contour);
      },
      (pct: number) => {
        if (onProgress) {
          onProgress(pct);
        }
      }
    );

    // Destructure the options with default values
    const {
      onsetThresh = 0.5,
      frameThresh = 0.3,
      minNoteLen = 5,
      inferOnsets = true,
      maxFreq = null,
      minFreq = null,
      melodiaTrick = true,
      energyTolerance = 11,
    } = options || {};

    // Convert the collected data to note events
    const notes = noteFramesToTime(
      addPitchBendsToNoteEvents(
        contours,
        outputToNotesPoly(frames, onsets, onsetThresh, frameThresh, minNoteLen, inferOnsets, maxFreq, minFreq, melodiaTrick, energyTolerance)
      )
    );
    const noteEvents = notes.map((n) => ({
      pitch: n.pitchMidi,
      duration: n.durationSeconds,
      onset: n.startTimeSeconds,
      velocity: n.amplitude,
    }));

    // Sort the note events by onset time and pitch
    noteEvents.sort((a, b) => a.onset - b.onset || a.pitch - b.pitch);

    // Call the success callback with the resulting note events
    onSuccess(noteEvents);
  } catch (error) {
    // Call the error callback if provided
    if (onError) {
      onError(error);
    }
  }
}

// Define audio detection options type
type detectionSettings = {
  onsetThresh?: number;
  frameThresh?: number;
  minNoteLen?: number;
  inferOnsets?: boolean;
  maxFreq?: number | null;
  minFreq?: number | null;
  melodiaTrick?: boolean;
  energyTolerance?: number;
};

// Define the callback types
type onSuccessCallback = (notes: NoteEvent[]) => void;
type onErrorCallback = (error: any) => void;
type onProgressCallback = (percent: number) => void;
