interface NoteEvent {
  pitch: number;
  duration: number;
  onset: number;
  velocity: number;
}

export default function generateRandomNoteEvents(durationInSeconds: number, tempo: number): NoteEvent[] {
  const noteEvents: NoteEvent[] = [];
  const maxDuration = 60 / tempo;

  let currentTime = 0;

  while (currentTime < durationInSeconds) {
    const pitch = Math.floor(Math.random() * 88 + 21);
    const duration = Math.random() * maxDuration * 0.75 + maxDuration * 0.25;
    const onset = Math.random() * maxDuration;
    const velocity = Math.random();

    const noteEvent: NoteEvent = {
      pitch,
      duration,
      onset: currentTime,
      velocity,
    };

    noteEvents.push(noteEvent);
    currentTime += onset;
  }

  return noteEvents;
}
