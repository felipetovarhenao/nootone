import { ChordEvent, ChordEventSegment } from "../types/music";
import getDeepCopy from "./getDeepCopy";

export default function segmentChordEvents(chordEvents: ChordEvent[], segmentDuration: number): ChordEventSegment[] {
  const totalDuration = Math.max(...chordEvents.map((chord) => chord.onset + Math.max(...chord.notes.map((note) => note.duration))));
  const numSegments = Math.ceil(totalDuration / segmentDuration);
  const chordSegments: ChordEventSegment[] = [...Array(numSegments).keys()].map((i) => ({ onset: i * segmentDuration, chords: [] }));
  for (let i = 0; i < chordEvents.length; i++) {
    const chordEvent = getDeepCopy(chordEvents[i]);
    const segmentIndex = Math.floor(chordEvent.onset / segmentDuration + 1e-5);
    const segmentStart = segmentIndex * segmentDuration;
    const segmentEnd = segmentStart + segmentDuration;

    const nextChordEvent: ChordEvent = { onset: segmentEnd, notes: [] };

    chordEvent.notes.forEach((note) => {
      const noteEnd = chordEvent.onset + note.duration;
      if (noteEnd > segmentEnd) {
        const noteDuration = note.duration;
        note.duration = segmentEnd - chordEvent.onset;
        nextChordEvent.notes.push({ duration: noteDuration - note.duration, pitch: note.pitch, velocity: note.velocity });
      }
    });
    if (nextChordEvent.notes.length > 0) {
      segmentChordEvents([nextChordEvent], segmentDuration).forEach((seg) => {
        const segIndex = Math.floor(seg.onset / segmentDuration + 1e-5);
        seg.chords.forEach((chord) => chordSegments[segIndex].chords.push(chord));
      });
    }
    chordSegments[segmentIndex].chords.push(chordEvent);
  }
  return chordSegments.filter((x) => x.chords.length > 0).sort((a, b) => a.onset - b.onset);
}
