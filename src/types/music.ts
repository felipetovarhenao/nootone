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
  PAD = "buzzPad",
  EBASS = "electricBass",
  ACOUSTIC_BASS = "acousticBass",
}

export type InstrumentalPart = {
  name: InstrumentName;
  chordEvents: ChordEvent[];
};
