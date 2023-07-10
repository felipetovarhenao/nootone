import { Accidental } from "./types";

const pitchNames: Record<number, { name: string; accidental?: string }> = {
  0: { name: "c" },
  1: { name: "c", accidental: Accidental.SHARP },
  2: { name: "d" },
  3: { name: "e", accidental: Accidental.FLAT },
  4: { name: "e" },
  5: { name: "f" },
  6: { name: "f", accidental: Accidental.SHARP },
  7: { name: "g" },
  8: { name: "a", accidental: Accidental.FLAT },
  9: { name: "a" },
  10: { name: "b", accidental: Accidental.FLAT },
  11: { name: "b" },
};

export default pitchNames;
