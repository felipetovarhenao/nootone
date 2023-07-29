import { AudioFeatures, Recording } from "../../types/audio";
import { Fraction } from "../../types/math";
import { InstrumentName } from "../../types/music";

export type HarmonizerSettings = {
  style: string;
  patternSize: number;
  segSizes: number[];
  rhythmicComplexity: { min: number; max: number };
  maxSubdiv: number;
  instrumentName: InstrumentName;
  timeSignature: Fraction;
  groovinessRange: { min: number; max: number };
};

export type HarmonizerPayload = {
  recording: Recording;
  settings: HarmonizerSettings;
};

export type HarmonizerReturnType = {
  features: Pick<AudioFeatures, "chordEvents">;
  variation: Omit<Recording, "variations">;
};

export type ParsedHarmonizerSettings = HarmonizerSettings & {
  maxAttacks: number;
  numAttacks: number;
  contourSize: number;
  grooviness: number;
  segSize: number;
};
