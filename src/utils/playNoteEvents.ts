import pitchToFrequency from "./pitchToFrequency";
import createNewAudioContext from "./createNewAudioContext";
export interface NoteEvent {
  pitch: number;
  onset: number;
  duration: number;
  velocity?: number;
}

/**
 * Plays a sequence of note events.
 *
 * @param notes - An array of note events.
 */
export default function playNoteEvents(notes: NoteEvent[]): void {
  const audioContext = createNewAudioContext();

  notes.forEach((note) => {
    const carrierOsc = audioContext.createOscillator();
    const modOsc = audioContext.createOscillator();

    // Set the frequency of the carrier oscillator based on the note's pitch
    carrierOsc.frequency.value = pitchToFrequency(note.pitch);

    // Set the frequency of the modulator oscillator as a multiple of the note's pitch
    modOsc.frequency.value = pitchToFrequency(note.pitch) * Math.ceil(Math.random() * 2);

    // Create a gain node to control the modulation amount
    const modGain = audioContext.createGain();
    modOsc.connect(modGain);
    modGain.connect(carrierOsc.frequency);
    modGain.gain.value = 1000;

    const startTime = audioContext.currentTime + note.onset;
    const duration = Math.max(0.125, note.duration);
    const attack = duration * 0.125;
    const release = duration * 0.85;
    const endTime = startTime + duration;

    // Create a gain node to control the overall volume
    const gainNode = audioContext.createGain();
    const maxGain = 0.1; // Adjust the maximum volume here

    // Set the initial gain to 0
    gainNode.gain.setValueAtTime(0, startTime);
    // Gradually increase the gain to the maximum value over the attack time
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + attack);
    // Gradually decrease the gain to a lower value over the release time
    gainNode.gain.linearRampToValueAtTime(maxGain * 0.5, startTime + release);
    // Set the gain to 0 at the end time to stop the sound
    gainNode.gain.linearRampToValueAtTime(0, endTime);

    // Connect the carrier oscillator, gain node, and audio destination
    carrierOsc.connect(gainNode).connect(audioContext.destination);

    // Start the oscillators at the specified start time
    carrierOsc.start(startTime);
    modOsc.start(startTime);

    // Stop the oscillators at the specified end time
    carrierOsc.stop(endTime);
    modOsc.stop(endTime);
  });
}
