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
}
