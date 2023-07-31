import { ChordEvent, ChordEventSegment } from "../types/music";
import getDeepCopy from "./getDeepCopy";

export default function segmentChordEvents(chordEvents: ChordEvent[], segmentDuration: number): ChordEventSegment[] {
  // get number of segments based on total duration of chord event sequence
  const totalDuration = Math.max(...chordEvents.map((chord) => chord.onset + Math.max(...chord.notes.map((note) => note.duration))));
  const numSegments = Math.ceil(totalDuration / segmentDuration);

  // initialize empty chord segments
  const chordSegments: ChordEventSegment[] = [...Array(numSegments).keys()].map((i) => ({ onset: i * segmentDuration, chords: [] }));

  // iterate through each chord event and push to segment
  for (let i = 0; i < chordEvents.length; i++) {
    const chordEvent = getDeepCopy(chordEvents[i]);

    // get segment information
    const segmentIndex = Math.floor(chordEvent.onset / segmentDuration + 1e-5);
    const segmentStart = segmentIndex * segmentDuration;
    const segmentEnd = segmentStart + segmentDuration;

    // initialize new chord event in case note durations exceed segment end
    const nextChordEvent: ChordEvent = { onset: segmentEnd, notes: [] };

    // check for cross-segment notes
    chordEvent.notes.forEach((note) => {
      const noteEnd = chordEvent.onset + note.duration;
      if (noteEnd > segmentEnd) {
        const noteDuration = note.duration;
        note.duration = segmentEnd - chordEvent.onset;
        nextChordEvent.notes.push({ duration: noteDuration - note.duration, pitch: note.pitch, velocity: note.velocity });
      }
    });

    // for cross-segment notes exist, get remaining segments recursively
    if (nextChordEvent.notes.length > 0) {
      segmentChordEvents([nextChordEvent], segmentDuration).forEach((seg) => {
        const segIndex = Math.floor(seg.onset / segmentDuration + 1e-5);
        seg.chords.forEach((chord) => chordSegments[segIndex].chords.push(chord));
      });
    }
    chordSegments[segmentIndex].chords.push(chordEvent);
  }

  // filter out empty segments and sort by onset
  return chordSegments.filter((x) => x.chords.length > 0).sort((a, b) => a.onset - b.onset);
}
