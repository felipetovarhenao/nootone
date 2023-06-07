import { NoteEvent } from "../types/music";

/**
 * Groups an array of note events by their onset times.
 *
 * @param noteEvents - The array of note events to be grouped.
 * @returns An array of note event arrays, where each inner array contains note events with the same onset time.
 */
export default function groupNoteEventsByOnset(noteEvents: NoteEvent[]): NoteEvent[][] {
  // Group note events by onset
  const groupedNoteEvents: { [onset: number]: NoteEvent[] } = {};

  // Iterate over each note event
  for (const noteEvent of noteEvents) {
    const { onset } = noteEvent;
    if (groupedNoteEvents[onset]) {
      groupedNoteEvents[onset].push(noteEvent); // Add the note event to the existing group
    } else {
      groupedNoteEvents[onset] = [noteEvent]; // Create a new group with the note event
    }
  }

  // Sort note events by onsets
  const sortedOnsets = Object.keys(groupedNoteEvents)
    .map(Number)
    .sort((a, b) => a - b); // Get the sorted onset times
  const sortedNoteEvents: NoteEvent[][] = sortedOnsets.map((onset) => groupedNoteEvents[onset]); // Retrieve the note events for each onset time

  return sortedNoteEvents; // Return the grouped and sorted note events
}
