import { ChordEvent, NoteEvent } from "../types/music";
import generateURNArray from "./generateURNArray";

/**
 * Arpeggiates a sequence of chords.
 *
 * @param chords - An array of chord events.
 * @param tempo - The tempo of the arpeggiated sequence.
 * @param patternSize - The size of the pattern to generate. Defaults to 2.
 * @returns An array of note events representing the arpeggiated sequence.
 */
export default function arpeggiateChords(chords: ChordEvent[], tempo: number, patternSize: number = 2): NoteEvent[] {
  const arpeggioSequence: NoteEvent[] = [];
  const numChords = chords.length;
  let subDivision;

  // Determine the subdivision based on the tempo
  if (tempo > 110) {
    subDivision = 2;
  } else if (tempo > 91) {
    subDivision = 3;
  } else if (tempo > 60) {
    subDivision = 4;
  } else {
    subDivision = 6;
  }

  const attacksPerPattern = [2, 4, 6][Math.floor(Math.random() * 3)];

  const noteDuration = 60 / (tempo * subDivision);
  const patternRange = Math.random() * 3 + 4;

  // Generate a pattern array
  const pattern = generateURNArray(patternSize * subDivision, patternRange).map((x) => x / patternRange);

  const quantum = (noteDuration * pattern.length) / attacksPerPattern;

  for (let i = 0; i < numChords; i++) {
    const chord = chords[i];
    let segSize = 0;

    // Calculate the segment size based on the onset of the next chord or the duration of the current chord's notes
    if (i < numChords - 1) {
      segSize = chords[i + 1].onset - chord.onset;
    } else {
      segSize = Math.max(...chord.notes.map((n) => n.duration));
    }

    const chordSize = chord.notes.length;
    let patternIndex = 0;

    // Iterate over the segment and create note events
    for (let onset = 0; onset < segSize; onset += noteDuration) {
      let noteIndex = Math.floor(pattern[patternIndex] * chordSize);
      const note = chord.notes[noteIndex];

      // Create a note event and add it to the arpeggio sequence
      arpeggioSequence.push({
        pitch: note.pitch,
        onset: Math.floor(onset / quantum) * quantum + chord.onset,
        velocity: pattern[patternIndex] * 0.4 + 0.5,
        duration: chord.onset + segSize - onset,
      });

      patternIndex = (patternIndex + 1) % pattern.length;
    }
  }

  return arpeggioSequence;
}
