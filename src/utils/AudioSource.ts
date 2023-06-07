import createNewAudioContext from "./createNewAudioContext";

export default abstract class AudioSource {
  protected context: AudioContext | OfflineAudioContext;
  protected gain: GainNode;
  constructor(context?: AudioContext | OfflineAudioContext, preconnect: boolean = true) {
    this.context = context || createNewAudioContext();
    this.gain = this.context.createGain();
    if (preconnect) {
      this.gain.connect(this.context.destination);
    }
  }
  /**
   * Converts a Float32Array audio data to an AudioBuffer.
   * @param array The audio data as a Float32Array.
   * @param sampleRate The sample rate of the audio data.
   * @returns The converted AudioBuffer.
   */
  public arrayToBuffer(array: Float32Array): AudioBuffer {
    const buffer = this.context.createBuffer(1, array.length, this.context.sampleRate);
    buffer.getChannelData(0).set(array);
    return buffer;
  }

  public connect(node: AudioNode) {
    this.gain.connect(node);
  }

  public disconnect() {
    this.gain.disconnect();
  }
}
