import pitchToFrequency from "./pitchToFrequency";

export interface NoteEvent {
  pitch: number;
  onset: number;
  duration: number;
  velocity?: number;
}

export default function playNoteEvents(notes: NoteEvent[]): void {
  const audioContext = new AudioContext();

  notes.forEach((note) => {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = pitchToFrequency(note.pitch);

    const startTime = audioContext.currentTime + note.onset;
    const duration = Math.max(0.125, note.duration);
    const attack = duration * 0.1;
    const release = duration * 0.25;
    const endTime = startTime + duration;

    const gainNode = audioContext.createGain();
    const maxGain = 0.125; // Adjust the maximum volume here

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + attack); // Attack time
    gainNode.gain.linearRampToValueAtTime(maxGain * 0.707, startTime + release); // Release time
    gainNode.gain.linearRampToValueAtTime(0, endTime);

    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
}
