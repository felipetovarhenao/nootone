import { ChordEvent, NoteEvent } from "../../types/music";
import Arpeggiator from "../../utils/Arpeggiator";
import fillPitchRange from "../../utils/fillPitchRange";

export default function generateBassLine(
  chords: ChordEvent[],
  numAttacks: number,
  maxSubdiv: number,
  patternSize: number,
  contourSize: number,
  tempo: number
) {
  // utility function to randomize input value
  function randomizeValue(value: number) {
    return Math.max(1, Math.floor(value * Math.random()));
  }

  // get deep copy of chords
  const chordsCopy = JSON.parse(JSON.stringify(chords)) as ChordEvent[];

  const bassOffset = Math.floor(Math.random() * 20 + 21);

  console.log(bassOffset);
  const chordsAsScale = chordsCopy.map((chord) => {
    // get bass note and shift it to 24 - 36 note range
    const bassNote = chord.notes[0];

    bassNote.pitch = fillPitchRange([bassNote.pitch], bassOffset, bassOffset + 13)[0];

    // get remaining notes
    const upperNotes = chord.notes.slice(1);

    // order as a scale, above bass note
    const fullScale: Omit<NoteEvent, "onset">[] = fillPitchRange(
      upperNotes.map((n) => n.pitch),
      bassNote.pitch + 1,
      bassNote.pitch + 13
    ).map((pitch) => ({ ...upperNotes[0], pitch: pitch }));

    return {
      ...chord,
      notes: [bassNote, ...fullScale],
    };
  });

  // generate bass line and map to chord sequence
  const bassLine = Arpeggiator.arpeggiate(chordsAsScale, randomizeValue(numAttacks), maxSubdiv, patternSize, randomizeValue(contourSize), tempo!);
  bassLine.map((chord) => console.log(chord.notes));
  // filter chords to get monophonic line
  bassLine.forEach((chord) => {
    chord.notes = chord.notes.slice(0, 1);
  });

  return bassLine;
}
