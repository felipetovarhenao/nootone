import { ChordEvent, NoteEvent } from "./music";

export type AudioFeatures = {
  noteEvents?: NoteEvent[];
  chordEvents?: ChordEvent[];
  tempo?: number;
};

export type RecordingMetadata = {
  name: string;
  date: string;
  duration: number;
  tags: string[];
  features: AudioFeatures;
  variations: RecordingVariation[];
};

export type Recording = RecordingMetadata & {
  url: string;
};

export type RecordingVariation = Omit<Recording, "variations">;

export type CachedRecording = {
  blob: Blob;
  metadata: RecordingMetadata;
};
