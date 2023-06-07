import { ChordEvent, NoteEvent } from "../types/music";

export default function arpeggiateChords(chords: ChordEvent[]): NoteEvent[] {
  const arpeggioSequence: NoteEvent[] = [];
  const numChords = chords.length;
  for (let i = 0; i < numChords; i++) {
    const chord = chords[i];
    let segSize = 0;
    if (i < numChords - 1) {
      segSize = chords[i + 1].onset - chord.onset;
    } else {
      segSize = Math.max(...chord.notes.map((n) => n.duration));
    }
    const unit = segSize / 6;

    const chordSize = chord.notes.length;
    for (let j = 0; j < chordSize; j++) {
      const note = chord.notes[j];
      const normIndex = (j / chordSize) * segSize;
      let onset = chord.onset + normIndex;
      onset = Math.round(onset / unit) * unit;
      const velocity = (1 - j / (chordSize - 1)) * 0.5 + 0.5;
      arpeggioSequence.push({
        pitch: note.pitch,
        onset: onset,
        velocity: velocity,
        duration: segSize - normIndex,
      });
    }
  }
  return arpeggioSequence;
}
