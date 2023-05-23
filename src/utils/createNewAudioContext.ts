/**
 * Creates and returns a compatible AudioContext instance for different browsers.
 * @returns {AudioContext} The created AudioContext instance, or null if not supported.
 */
export default function createNewAudioContext(sampleRate?: number): AudioContext {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext || (window as any).mozAudioContext || (window as any).msAudioContext;

  return new AudioContext(sampleRate ? { sampleRate: sampleRate } : undefined);
}
