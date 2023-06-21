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
  PIANO = "piano",
  GUITAR = "guitar",
}

export type InstrumentalPart = {
  name: InstrumentName;
  chordEvents: ChordEvent[];
};
