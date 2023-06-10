import { ChordEvent, NoteEvent } from "../types/music";

export default function chordEventsToNoteEvents(chords: ChordEvent[]) {
  const notes: NoteEvent[] = [];
  chords.forEach((chord) =>
    chord.notes.forEach((note) => {
      notes.push({
        ...note,
        onset: chord.onset,
      });
    })
  );
  return notes;
}
