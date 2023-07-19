import { InstrumentalPart, NoteEvent, SymbolicMusicSequence } from "./music";

export type AudioFeatures = {
  tempo: number;
  noteEvents?: NoteEvent[];
  rms?: {
    hopSize: number;
    data: number[];
  };
  symbolicTranscription?: SymbolicMusicSequence;
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
