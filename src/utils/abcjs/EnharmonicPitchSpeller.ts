import { Accidental, EnharmonicPitch, KeySignature, PitchName, ScaleMode } from "./types";

export const enharmonicSchema = {
  [ScaleMode.MAJOR]: [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6],
  [ScaleMode.MINOR]: [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6],
};

const accidentalToSemitonesTable: Record<Accidental, number> = {
  [Accidental.FLAT]: -1,
  [Accidental.SHARP]: 1,
  [Accidental.DOUBLE_FLAT]: -2,
  [Accidental.DOUBLE_SHARP]: 2,
};

export const pitchClassToKeySignatureTable: Record<ScaleMode, Record<number, EnharmonicPitch>> = {
  [ScaleMode.MAJOR]: {
    0: { name: PitchName.C },
    1: { name: PitchName.D, accidental: Accidental.FLAT },
    2: { name: PitchName.D },
    3: { name: PitchName.E, accidental: Accidental.FLAT },
    4: { name: PitchName.E },
    5: { name: PitchName.F },
    6: { name: PitchName.G, accidental: Accidental.FLAT },
    7: { name: PitchName.G },
    8: { name: PitchName.A, accidental: Accidental.FLAT },
    9: { name: PitchName.A },
    10: { name: PitchName.B, accidental: Accidental.FLAT },
    11: { name: PitchName.B },
  },
  [ScaleMode.MINOR]: {
    0: { name: PitchName.C },
    1: { name: PitchName.C, accidental: Accidental.SHARP },
    2: { name: PitchName.D },
    3: { name: PitchName.E, accidental: Accidental.FLAT },
    4: { name: PitchName.E },
    5: { name: PitchName.F },
    6: { name: PitchName.F, accidental: Accidental.SHARP },
    7: { name: PitchName.G },
    8: { name: PitchName.G, accidental: Accidental.SHARP },
    9: { name: PitchName.A },
    10: { name: PitchName.B, accidental: Accidental.FLAT },
    11: { name: PitchName.B },
  },
};

export default class EnharmonicPitchSpeller {
  private static pitchNameToPitchClass(pitchName: PitchName): number {
    return {
      [PitchName.C]: 0,
      [PitchName.D]: 2,
      [PitchName.E]: 4,
      [PitchName.F]: 5,
      [PitchName.G]: 7,
      [PitchName.A]: 9,
      [PitchName.B]: 11,
    }[pitchName];
  }
  
  public static getKeySignature(pitchClass: number, minor?: boolean): KeySignature {
    const mode = minor ? ScaleMode.MINOR : ScaleMode.MAJOR;
    return { ...pitchClassToKeySignatureTable[mode][pitchClass], mode };
  }

  private static accidentalToSemitones(accidental?: Accidental): number {
    if (!accidental) {
      return 0;
    }
    return accidentalToSemitonesTable[accidental];
  }

  private static semitonesToAccidental(semitones: number): Accidental | undefined {
    const accidentals = Object.keys(accidentalToSemitonesTable) as Accidental[];
    for (let i = 0; i < accidentals.length; i++) {
      const accidental = accidentals[i];
      if (accidentalToSemitonesTable[accidental] === semitones) {
        return accidental;
      }
    }
    return;
  }

  public static keySignatureToString(keySignature: KeySignature) {
    let accidental = "";
    if (keySignature.accidental) {
      const accidentalMapper: Record<Accidental, string> = {
        [Accidental.FLAT]: "b",
        [Accidental.DOUBLE_FLAT]: "bb",
        [Accidental.SHARP]: "#",
        [Accidental.DOUBLE_SHARP]: "#",
      };
      accidental += accidentalMapper[keySignature.accidental];
    }
    const keySig = keySignature.name + accidental;
    const mode = keySignature.mode === ScaleMode.MAJOR ? "" : "m";
    return keySig + mode;
  }

  public static getEnharmonicPitch(pitchClass: number, keySignature: KeySignature) {
    // get key signature root pitch name as pitch class
    const diatonicRoot = this.pitchNameToPitchClass(keySignature.name);

    // get key signature root pitch accidental in semitones
    const diatonicRootOffset = this.accidentalToSemitones(keySignature.accidental);

    // get key signature as absolute pitch class
    const chromaticRoot = (diatonicRoot + diatonicRootOffset + 12) % 12;

    // get enharmonic schema for key signature mode
    const schema = enharmonicSchema[keySignature.mode];

    // normalize pitch class to C-based scale
    const normalizedPitchClass = (pitchClass + 12 - chromaticRoot) % 12;

    // get pitch name index in C-based scale
    const normalizedDiatonicPitchIndex = schema[normalizedPitchClass];

    const pitchNames = Object.keys(PitchName) as PitchName[];

    const diatonicRootIndex = pitchNames.indexOf(keySignature.name);

    const pitchNameIndex = (diatonicRootIndex + normalizedDiatonicPitchIndex + 7) % 7;

    const pitchName = pitchNames[pitchNameIndex];

    const diatonicPitchClass = this.pitchNameToPitchClass(pitchName);

    // get C-based accidental in semitones
    let diatonicPitchClassOffset = pitchClass - diatonicPitchClass;

    if (diatonicPitchClassOffset > 6) {
      diatonicPitchClassOffset -= 12;
    } else if (diatonicPitchClass < -6) {
      diatonicPitchClassOffset += 12;
    }

    const accidental = this.semitonesToAccidental(diatonicPitchClassOffset);

    return {
      name: pitchName,
      accidental: accidental,
    };
  }
}
