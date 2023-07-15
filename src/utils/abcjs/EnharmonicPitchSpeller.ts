import { Accidental, EnharmonicPitch, KeySignature, PitchName, ScaleMode } from "./types";

export const enharmonicSchema = {
  [ScaleMode.MAJOR]: [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6],
  [ScaleMode.MINOR]: [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6],
};

const accidentalToSemitonesTable: Record<Accidental, number> = {
  [Accidental.NATURAL]: 0,
  [Accidental.FLAT]: -1,
  [Accidental.SHARP]: 1,
  [Accidental.DOUBLE_FLAT]: -2,
  [Accidental.DOUBLE_SHARP]: 2,
};

export const pitchClassToKeySignatureTable: Record<ScaleMode, Record<number, EnharmonicPitch>> = {
  [ScaleMode.MAJOR]: {
    0: { name: PitchName.C, accidental: Accidental.NATURAL },
    1: { name: PitchName.D, accidental: Accidental.FLAT },
    2: { name: PitchName.D, accidental: Accidental.NATURAL },
    3: { name: PitchName.E, accidental: Accidental.FLAT },
    4: { name: PitchName.E, accidental: Accidental.NATURAL },
    5: { name: PitchName.F, accidental: Accidental.NATURAL },
    6: { name: PitchName.G, accidental: Accidental.FLAT },
    7: { name: PitchName.G, accidental: Accidental.NATURAL },
    8: { name: PitchName.A, accidental: Accidental.FLAT },
    9: { name: PitchName.A, accidental: Accidental.NATURAL },
    10: { name: PitchName.B, accidental: Accidental.FLAT },
    11: { name: PitchName.B, accidental: Accidental.NATURAL },
  },
  [ScaleMode.MINOR]: {
    0: { name: PitchName.C, accidental: Accidental.NATURAL },
    1: { name: PitchName.C, accidental: Accidental.SHARP },
    2: { name: PitchName.D, accidental: Accidental.NATURAL },
    3: { name: PitchName.E, accidental: Accidental.FLAT },
    4: { name: PitchName.E, accidental: Accidental.NATURAL },
    5: { name: PitchName.F, accidental: Accidental.NATURAL },
    6: { name: PitchName.F, accidental: Accidental.SHARP },
    7: { name: PitchName.G, accidental: Accidental.NATURAL },
    8: { name: PitchName.G, accidental: Accidental.SHARP },
    9: { name: PitchName.A, accidental: Accidental.NATURAL },
    10: { name: PitchName.B, accidental: Accidental.FLAT },
    11: { name: PitchName.B, accidental: Accidental.NATURAL },
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
        [Accidental.NATURAL]: "",
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

  public static keySignatureToPitchClass(keySignature: KeySignature) {
    // get key signature root pitch name as pitch class
    const diatonicRoot = this.pitchNameToPitchClass(keySignature.name);

    // get key signature root pitch accidental in semitones
    const diatonicRootOffset = this.accidentalToSemitones(keySignature.accidental);

    // get key signature as absolute pitch class
    const chromaticRoot = (diatonicRoot + diatonicRootOffset + 12) % 12;

    return chromaticRoot;
  }

  public static getEnharmonicPitch(pitchClass: number, keySignature: KeySignature) {
    // get key signature as absolute pitch class
    const chromaticRoot = this.keySignatureToPitchClass(keySignature);

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

    if (diatonicPitchClassOffset > 2) {
      diatonicPitchClassOffset -= 12;
    } else if (diatonicPitchClassOffset < -2) {
      diatonicPitchClassOffset += 12;
    }

    if (Math.abs(diatonicPitchClassOffset) > 2) {
      console.log("Fix bug — diatonic pitch class offset is greater than 2: ", diatonicPitchClassOffset);
    }

    const accidental = this.semitonesToAccidental(diatonicPitchClassOffset);

    return {
      name: pitchName,
      accidental: accidental,
    };
  }

  public static getDefaultAccidentals(keySignature: KeySignature): Record<PitchName, Accidental> {
    const root = this.keySignatureToPitchClass(keySignature);
    const diatonicScale = keySignature.mode === ScaleMode.MAJOR ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
    const accidentals: any = {};
    diatonicScale.map((x) => {
      const pitch = this.getEnharmonicPitch((x + root) % 12, keySignature);
      accidentals[pitch.name as PitchName] = pitch.accidental as Accidental;
    });
    return accidentals;
  }
}
