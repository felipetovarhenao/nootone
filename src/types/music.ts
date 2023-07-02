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

export enum InstrumentName {
  PIANO = "grandPiano",
  GUITAR = "nylonGuitar",
  EPIANO = "electricPiano",
  MANDOLIN = "mandolin",
  PAD = "sineSynth",
  ELECTRIC_BASS = "electricBass",
  ACOUSTIC_BASS = "acousticBass",
  UPRIGHT_BASS = "uprightBass",
  BRASS_SYNTH = "brassSynth",
}

export type InstrumentalPart = {
  name: InstrumentName;
  chordEvents: ChordEvent[];
};

export type SymbolicMusicSequence = {
  instrumentalParts: InstrumentalPart[];
};
