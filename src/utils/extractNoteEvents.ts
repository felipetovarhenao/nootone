interface NoteEvent {
  pitch: number;
  duration: number;
  onset: number;
}

/**
 * Extracts note events from pitch and confidence arrays.
 * @param pitchArray - Array of pitch values.
 * @param confidenceArray - Array of confidence values corresponding to each pitch.
 * @param frameDuration - Duration of each frame in seconds.
 * @param confidenceThreshold - Confidence threshold for considering a pitch as valid. Default is 0.98.
 * @returns An array of filtered note events.
 * @throws Error if pitchArray and confidenceArray have different lengths.
 */
export default function extractNoteEvents(
  pitchArray: Float32Array,
  confidenceArray: Float32Array,
  frameDuration: number,
  confidenceThreshold: number = 0.98
): NoteEvent[] {
  if (pitchArray.length !== confidenceArray.length) {
    throw new Error("pitchArray and confidenceArray must have the same length");
  }

  // Array to store the filtered note events
  const filteredNoteEvents: NoteEvent[] = [];

  // Helper function to calculate duration from onset and offset
  const onsetToDuration = (onset: number, offset: number): number => offset - onset;

  // Variable to keep track of the currently active note
  let activeNote: NoteEvent | null = null;

  // Iterate over each frame
  for (let i = 0; i < pitchArray.length; i++) {
    const pitch = Math.round(pitchArray[i]);
    const confidence = confidenceArray[i];
    const onset = i * frameDuration;

    if (confidence > confidenceThreshold) {
      // If pitch confidence is above threshold, check if pitch has changed or if there is no active pitch
      if (activeNote === null || activeNote.pitch !== pitch) {
        // If there is an active note, update its duration
        if (activeNote !== null) {
          activeNote.duration = onsetToDuration(activeNote.onset, onset);
        }

        // Create a new active note and add it to the filtered note events
        activeNote = {
          pitch,
          duration: 0,
          onset,
        };

        filteredNoteEvents.push(activeNote);
      }
    } else if (activeNote !== null) {
      // If there's an active note and pitch confidence falls below threshold, update its duration and nullify the reference
      activeNote.duration = onsetToDuration(activeNote.onset, onset);
      activeNote = null;
    }
  }

  if (activeNote !== null) {
    // If there is an active note at the end, update its duration based on the final offset
    activeNote.duration = onsetToDuration(activeNote.onset, pitchArray.length * frameDuration);
  }

  // Filter out note events with duration less than 2 frames
  return filteredNoteEvents.filter((n) => n.duration > frameDuration * 2);
}
