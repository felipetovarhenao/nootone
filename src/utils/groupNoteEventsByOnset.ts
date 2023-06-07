// import { NoteEvent } from "./playNoteEvents";

import { ChordEvent } from "../types/music";
import { NoteEvent } from "../types/music";
import { NoteEventSegment } from "../types/music";

export default function noteEventsToChordEvents(noteEvents: NoteEvent[]): ChordEvent[] {
  // Sort the note events by onset
  const sortedNoteEvents = noteEvents.sort((a, b) => a.onset - b.onset);

  // Group note events by onset
  const noteEventSegments: NoteEventSegment[] = [];
  let currentSegment: NoteEventSegment | null = null;
  for (const noteEvent of sortedNoteEvents) {
    if (!currentSegment || noteEvent.onset !== currentSegment.onset) {
      currentSegment = {
        onset: noteEvent.onset,
        notes: [],
      };
      noteEventSegments.push(currentSegment);
    }
    currentSegment.notes.push(noteEvent);
  }

  // Convert note event segments to chord events
  const chordEvents: ChordEvent[] = noteEventSegments.map((segment) => {
    return {
      onset: segment.onset,
      notes: segment.notes.map((note) => {
        const { onset, ...rest } = note;
        return rest;
      }),
    };
  });

  return chordEvents;
}
