import { PitchDetector as Pitchy } from "pitchy";
import frequencyToPitch from "./frequencyToPitch";
import getRMS from "./getRMS";
import getMedian from "./getMedian";
import { ChordEvent, NoteEvent } from "../types/music";

const LOWEST_PITCH = 40;

export default class PitchDetector {
  private hopLength: number;
  private frameLength: number;

  constructor(hopLength: number = 256, frameLength: number = 2048) {
    this.hopLength = hopLength;
    this.frameLength = frameLength;
  }

  private applyWeightFilter(array: Float32Array, weights: Float32Array, filterSize: number): number[] {
    const filteredArray: number[] = [];

    const halfFilterSize = Math.floor(filterSize / 2);
    for (let i = 0; i < array.length; i++) {
      const st = Math.max(0, i - halfFilterSize);
      const end = Math.min(array.length, i + halfFilterSize);
      const arrWindow = array.slice(st, end);
      const weightWindow = weights.slice(st, end);
      filteredArray.push(
        arrWindow.reduce((sum, value, idx) => sum + value * weightWindow[idx], 0) / weightWindow.reduce((sum, weight) => sum + weight, 0)
      );
    }

    return filteredArray;
  }

  private getFrequencyContour(
    audioArray: Float32Array,
    sampleRate: number
  ): {
    pitchArray: Float32Array;
    clarityArray: Float32Array;
    rmsArray: Float32Array;
  } {
    // Create a pitch detector for the given frame length
    const detector = Pitchy.forFloat32Array(this.frameLength);

    // Calculate the number of frames
    const numFrames = Math.floor((audioArray.length - this.frameLength) / this.hopLength);

    // Initialize arrays to store the pitch and clarity values for each frame
    const pitchArray = new Float32Array(numFrames);
    const clarityArray = new Float32Array(numFrames);
    const rmsArray = new Float32Array(numFrames);
    let rmsMin = Infinity;
    let rmsMax = -Infinity;

    // Process each frame
    for (let i = 0; i < numFrames; i++) {
      // Calculate the start index of the current frame
      const st = i * this.hopLength;

      // Extract the current frame from the audio data
      const frame = audioArray.slice(st, st + this.frameLength);

      // Find the pitch and clarity of the current frame using the pitch detector
      const [frequency, clarity] = detector.findPitch(frame, sampleRate);

      // Convert the frequency to pitch
      const pitch = frequencyToPitch(frequency);

      const rms = getRMS(frame);

      // Apply the median filter to smooth the pitch and clarity values
      pitchArray[i] = pitch > LOWEST_PITCH ? pitch : 0;
      clarityArray[i] = clarity;
      rmsArray[i] = rms;
      rmsMin = Math.min(rmsMin, rmsArray[i]);
      rmsMax = Math.max(rmsMax, rmsArray[i]);
    }

    const rmsRange = rmsMax - rmsMin;
    rmsArray.forEach((x, i) => {
      const y = (x - rmsMin) / rmsRange;
      rmsArray[i] = y * 0.6 + 0.4;
    });

    return {
      pitchArray,
      clarityArray,
      rmsArray,
    };
  }

  private getPitchSegments(pitchArray: number[], sr: number, tempo: number, subdiv: number): number[] {
    const frameDuration = this.hopLength / sr;
    const beatDuration = 60 / tempo;
    const subdivDuration = beatDuration / subdiv;
    const numSegments = Math.floor((pitchArray.length * frameDuration) / subdivDuration);
    const pitchSegments: number[][] = Array.from({ length: numSegments }, () => []);

    for (let i = 0; i < pitchArray.length; i++) {
      const pitchOnset = i * frameDuration;
      const binIndex = Math.floor(pitchOnset / subdivDuration);

      if (binIndex >= numSegments) {
        continue;
      }

      pitchSegments[binIndex].push(pitchArray[i]);
    }

    return pitchSegments.map((pitchBin) => Math.round(getMedian(pitchBin)));
  }

  private pitchSegmentsToNoteEvents(pitchArray: number[], segmentDuration: number): NoteEvent[] {
    const notes: NoteEvent[] = [];
    let noteStart = 0;
    let lastPitch = pitchArray[0];

    for (let i = 0; i < pitchArray.length; i++) {
      const pitch = pitchArray[i];
      if (pitch !== lastPitch) {
        const nextOnset = i * segmentDuration;
        if (lastPitch > LOWEST_PITCH) {
          notes.push({
            onset: noteStart,
            pitch: lastPitch,
            duration: nextOnset - noteStart,
            velocity: 1,
          });
        }
        noteStart = nextOnset;
      }
      lastPitch = pitch;
    }

    if (lastPitch !== undefined && lastPitch > LOWEST_PITCH) {
      const noteEnd = pitchArray.length * segmentDuration;
      notes.push({
        onset: noteStart,
        pitch: lastPitch,
        duration: noteEnd - noteStart,
        velocity: 1,
      });
    }

    return notes;
  }

  private applyRMStoNoteEvents(noteEvents: NoteEvent[], rmsArray: Float32Array): void {
    for (let i = 0; i < noteEvents.length; i++) {
      const noteEvent = noteEvents[i];
      const startIndex = Math.min(Math.floor(noteEvent.onset * this.hopLength), rmsArray.length - 1);
      const endIndex = Math.max(startIndex + 1, Math.min(Math.floor((noteEvent.onset + noteEvent.duration) * this.hopLength), rmsArray.length));
      const velocity = getMedian(rmsArray.slice(startIndex, endIndex));
      noteEvents[i].velocity = Number.isNaN(velocity) ? 0.5 : velocity;
    }
  }

  private quantizeNoteEvents(noteEvents: NoteEvent[], gridSize: number) {
    const quantizedNoteEvents: NoteEvent[] = [];

    let lastPitch = null;
    for (let i = 0; i < noteEvents.length; i++) {
      const noteEvent = noteEvents[i];
      if (noteEvent.duration >= gridSize && (lastPitch == null || Math.abs(lastPitch - noteEvent.pitch) <= 12)) {
        noteEvent.onset = Math.floor(noteEvent.onset / gridSize) * gridSize;
        quantizedNoteEvents.push(noteEvent);
        lastPitch = noteEvent.pitch;
      }
    }

    return quantizedNoteEvents;
  }

  private applyMedianFilter(arr: number[], filterSize: number = 3): number[] {
    const filteredArray: number[] = [];
    const halfFilterSize = Math.floor(filterSize / 2);
    for (let i = 0; i < arr.length; i++) {
      const start = Math.max(0, i - halfFilterSize);
      const end = Math.min(arr.length, i + halfFilterSize + 1);
      const median = getMedian(arr.slice(start, end));
      filteredArray.push(median);
    }
    return filteredArray;
  }

  private applyLegato(noteEvents: NoteEvent[]) {
    noteEvents
      .sort((a, b) => a.onset - b.onset)
      .forEach((noteEvent, i) => {
        if (i === noteEvents.length - 1) {
          return;
        }
        const legatoDuration = Math.min(noteEvent.duration, noteEvents[i + 1].onset);
        if (legatoDuration > 1e-5) {
          noteEvent.duration = legatoDuration;
        }
      });
  }

  public getChordEvents(array: Float32Array, sampleRate: number, tempo: number, subdiv: number = 4): ChordEvent[] {
    const { pitchArray, clarityArray, rmsArray } = this.getFrequencyContour(array, sampleRate);

    const segmentSubdiv = subdiv * 2;

    const smoothPitchArray = this.applyWeightFilter(pitchArray, clarityArray, segmentSubdiv - 1);

    const pitchSegments = this.getPitchSegments(smoothPitchArray, sampleRate, tempo, segmentSubdiv);

    const smoothPitchSegments = this.applyMedianFilter(pitchSegments, subdiv - 1);

    const segmentDuration = 60 / (tempo * segmentSubdiv);

    const noteEvents = this.pitchSegmentsToNoteEvents(smoothPitchSegments, segmentDuration);

    this.applyRMStoNoteEvents(noteEvents, rmsArray);

    const quantizedNoteEvents = this.quantizeNoteEvents(noteEvents, segmentDuration * 2);

    this.applyLegato(quantizedNoteEvents);

    return quantizedNoteEvents.map((note) => ({
      onset: note.onset,
      notes: [{ pitch: note.pitch, duration: note.duration, velocity: note.velocity }],
    }));
  }
}
