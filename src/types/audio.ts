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

type RequiredExceptFor<T, TOptional extends keyof T> = Partial<T> & Omit<T, TOptional>;

export type GenericRecording = RequiredExceptFor<Recording, "variations">;

export type Recording = RecordingMetadata & {
  url: string;
};

export type RecordingVariation = Omit<Recording, "variations">;

export type CachedRecording = {
  blob: Blob;
  metadata: RecordingMetadata;
};
