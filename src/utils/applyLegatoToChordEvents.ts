import { ChordEvent } from "../types/music";

export default function applyLegatoToChordEvents(chordEvents: ChordEvent[]): void {
  chordEvents.sort((a, b) => a.onset - b.onset);
  if (chordEvents.length === 1) {
    return;
  }
  for (let i = 1; i < chordEvents.length; i++) {
    const maxDuration = chordEvents[i].onset - chordEvents[i - 1].onset;
    chordEvents[i - 1].notes.forEach((n) => (n.duration = Math.min(n.duration, maxDuration)));
  }
}
