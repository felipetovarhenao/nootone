import { ChordEvent, NoteEvent } from "../../types/music";
import Arpeggiator from "../../utils/Arpeggiator";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import fillPitchRange from "../../utils/fillPitchRange";
import noteEventsToChordEvents from "../../utils/noteEventsToChordEvents";

export default function generateBassLine(
  chords: ChordEvent[],
  numAttacks: number,
  maxSubdiv: number,
  patternSize: number,
  contourSize: number,
  tempo: number
) {
  // utility function to randomize input values
  function randomizeValue(value: number) {
    return Math.max(1, Math.floor(value * Math.random()));
  }

  // get deep copy of chords
  const chordsCopy = JSON.parse(JSON.stringify(chords)) as ChordEvent[];

  // re-order first chord, such that pitches are are close as possible (i.e., scale-like)
  reorderChordNotes(chordsCopy[0]);

  // apply voice leading to chords (pitch only)
  const chordProgression: number[][] = applyVoiceLeading(
    chordsCopy.map((chord) => chord.notes.map((note) => note.pitch)),
    21,
    55
  );

  // array of notes events to st
  const notes: NoteEvent[] = [];

  // push pitch values from chords to note event array
  chordProgression.forEach((chord: number[], i) =>
    chord
      .sort()
      .forEach((pitch: number) => notes.push({ pitch: pitch, onset: chordsCopy[i].onset, duration: chordsCopy[i].notes[0].duration, velocity: 1 }))
  );

  // convert note events to chord
  const chordsAsScale = noteEventsToChordEvents(notes);

  // generate bass line and map to chord sequence
  const bassLine = Arpeggiator.arpeggiate(chordsAsScale, randomizeValue(numAttacks), maxSubdiv, patternSize, randomizeValue(contourSize), tempo!);

  // filter chords to get monophonic line
  bassLine.forEach((chord) => {
    chord.notes = chord.notes.slice(0, 1);
  });

  return bassLine;
}

function reorderChordNotes(chord: ChordEvent) {
  const bassOffset = Math.floor(Math.random() * 20 + 28);
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

  chord.notes = [bassNote, ...fullScale];
}
