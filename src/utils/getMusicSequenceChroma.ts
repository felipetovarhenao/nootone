import { SymbolicMusicSequence } from "../types/music";

export default function getMusicSequenceChroma(musicSequence: SymbolicMusicSequence): number[] {
  const chroma = [...Array(12)].fill(0);

  musicSequence.instrumentalParts.forEach((instrumentalPart) =>
    instrumentalPart.chordEvents.forEach((chordEvent) =>
      chordEvent.notes.forEach((note) => {
        chroma[note.pitch % 12] += note.duration;
      })
    )
  );
  const maxBin = Math.max(...chroma);

  chroma.forEach((x, i) => (chroma[i] = x / maxBin));

  return chroma;
}
