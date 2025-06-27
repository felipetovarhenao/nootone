import { Fraction } from "./math";

export type NoteEvent = {
  pitch: number;
  onset: number;
  duration: number;
  velocity: number;
};

export type ChordEvent = {
  onset: number;
  notes: Omit<NoteEvent, "onset">[];
};

export type NoteEventSegment = {
  onset: number;
  notes: NoteEvent[];
};

export type ChordEventSegment = {
  onset: number;
  chords: ChordEvent[];
};

export enum InstrumentName {
  PIANO = "grandPiano",
  NYLON_GUITAR = "nylonGuitar",
  HARP = "harp",
  PAD = "sineSynth",
  UPRIGHT_BASS = "uprightBass",
}

export type InstrumentalPart = {
  name: InstrumentName;
  chordEvents: ChordEvent[];
};

export type SymbolicMusicSequence = {
  title: string;
  tempo: number;
  timeSignature: Fraction;
  instrumentalParts: InstrumentalPart[];
};
