import frequencyToPitch from "./frequencyToPitch";
import { PitchDetector } from "pitchy";
import createMedianFilter from "./createMedianFilter";

const detectPitch = (audioData: Float32Array, sampleRate: number, hopSize: number = 256, frameLength: number = 2048, filterSize: number = 11) => {
  const detector = PitchDetector.forFloat32Array(frameLength);
  const numFrames = Math.floor((audioData.length - frameLength) / hopSize);
  const pitches = new Float32Array(numFrames);
  const clarities = new Float32Array(numFrames);
  const pitchMedianFilter = createMedianFilter(filterSize);
  const clarityMedianFilter = createMedianFilter(filterSize);
  for (let i = 0; i < numFrames; i++) {
    const st = i * hopSize;
    const frame = audioData.slice(st, st + frameLength);
    const [frequency, clarity] = detector.findPitch(frame, sampleRate);
    const pitch = frequencyToPitch(frequency);
    pitches[i] = pitchMedianFilter(pitch);
    clarities[i] = clarityMedianFilter(clarity);
  }
  return extractNoteEvents(pitches, clarities, hopSize / sampleRate);
};

export default detectPitch;

interface NoteEvent {
  pitch: number;
  duration: number;
  onset: number;
}

function extractNoteEvents(
  pitchValues: Float32Array,
  confidenceValues: Float32Array,
  frameDuration: number,
  confidenceThreshold: number = 0.99
): NoteEvent[] {
  const noteEvents: NoteEvent[] = [];
  let activeNote: NoteEvent | null = null;

  for (let i = 0; i < pitchValues.length; i++) {
    const pitch = Math.round(pitchValues[i]);
    const confidence = confidenceValues[i];

    if (confidence > confidenceThreshold) {
      if (activeNote === null || activeNote.pitch !== pitch) {
        if (activeNote !== null) {
          noteEvents.push(activeNote);
        }
        const onset = i * frameDuration;
        activeNote = { pitch, duration: 0, onset };
      } else {
        activeNote.duration += frameDuration;
      }
    } else if (activeNote !== null) {
      noteEvents.push(activeNote);
      activeNote = null;
    }
  }

  if (activeNote !== null) {
    noteEvents.push(activeNote);
  }

  return noteEvents;
}
