import { InstrumentalPart, NoteEvent, SymbolicMusicSequence } from "./music";

export type AudioFeatures = {
  readonly tempo: number;
  noteEvents?: NoteEvent[];
  readonly rms?: {
    readonly hopSize: number;
    readonly data: number[];
  };
  symbolicTranscription?: SymbolicMusicSequence;
};

export type RecordingMetadata = {
  readonly date: string;
  readonly duration: number;
  name: string;
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

export enum TrackType {
  SYMBOLIC,
  AUDIO,
}

type TrackConfig = {
  gain?: number;
};

export type SymbolicTrack = {
  type: TrackType.SYMBOLIC;
  data: InstrumentalPart;
  config?: TrackConfig;
};

export type AudioTrack = {
  type: TrackType.AUDIO;
  data: {
    url: string;
    onset: number;
    duration: number;
  };
  config?: TrackConfig;
};

export type TrackSequence = Array<SymbolicTrack | AudioTrack>;
