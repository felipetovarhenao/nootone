import { ChordEvent, InstrumentalPart, NoteEvent } from "./music";

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

export enum TrackType {
  SYMBOLIC,
  AUDIO,
}

export type SymbolicTrack = {
  type: TrackType.SYMBOLIC;
  data: InstrumentalPart;
};

export type AudioTrack = {
  type: TrackType.AUDIO;
  data: {
    url: string;
    onset: number;
  };
};

export type TrackSequence = Array<SymbolicTrack | AudioTrack>;
