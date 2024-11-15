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
  ELECTRIC_GUITAR = "electricGuitar",
  EPIANO = "electricPiano",
  MANDOLIN = "mandolin",
  PAD = "sineSynth",
  ELECTRIC_BASS = "electricBass",
  ACOUSTIC_BASS = "acousticBass",
  UPRIGHT_BASS = "uprightBass",
  BRASS_SYNTH = "brassSynth",
  WAVE_SYNTH = "waveSynth",
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
