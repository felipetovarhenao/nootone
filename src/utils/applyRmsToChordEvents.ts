import { ChordEvent } from "../types/music";

export default function applyRmsToChordEvents(chordEvents: ChordEvent[], rmsArray: number[], hopSize: number, sampleRate: number) {
  const frameFactor = sampleRate / hopSize;
  for (let i = 0; i < chordEvents.length; i++) {
    const chord = chordEvents[i];
    const rmsIndex = Math.min(rmsArray.length - 1, Math.floor(chord.onset * frameFactor));
    const rms = rmsArray[rmsIndex];
    chordEvents[i].notes.forEach((note) => {
      note.velocity *= rms;
    });
  }
}
