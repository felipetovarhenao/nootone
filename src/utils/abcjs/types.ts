import { Fraction } from "../../types/math";

export type SymbolicEvent = {
  onset: Fraction;
  duration: Fraction;
  accent?: boolean;
  notes: number[];
};

export type SymbolicBeat = {
  onset: Fraction;
  duration: Fraction;
  events: SymbolicEvent[];
};

export type SymbolicMeasure = {
  onset: Fraction;
  duration: Fraction;
  beats: SymbolicBeat[];
};

export enum Accidental {
  SHARP = "^",
  FLAT = "_",
  DOUBLE_FLAT = "__",
  DOUBLE_SHARP = "^^",
}

export enum PitchName {
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  A = "A",
  B = "B",
}
export enum ScaleMode {
  MAJOR = "MAJOR",
  MINOR = "MINOR",
}

export type EnharmonicSchema = Record<ScaleMode, number[]>;

export type EnharmonicPitch = {
  name: PitchName;
  accidental?: Accidental;
};

export type KeySignature = EnharmonicPitch & {
  mode: ScaleMode;
};
