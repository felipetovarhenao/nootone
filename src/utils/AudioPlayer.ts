import AudioSource from "./AudioSource";
import audioArrayFromURL from "./audioArrayFromURL";

/**
 * AudioPlayer class extends AudioSource and provides functionality to load and play audio samples.
 */
export default class AudioPlayer extends AudioSource {
  protected buffer: AudioBuffer | null;

  /**
   * Constructs a new AudioPlayer instance.
   * @param context Optional AudioContext to use. If not provided, a new AudioContext will be created.
   * @param preconnect Specifies whether to preconnect the AudioPlayer to the AudioContext. Defaults to true.
   */
  constructor(context?: AudioContext, preconnect: boolean = true) {
    super(context, preconnect);
    this.buffer = null;
  }

  /**
   * Returns the current audio buffer.
   * @returns The current audio buffer.
   */
  public getBuffer(): AudioBuffer | null {
    return this.buffer;
  }

  /**
   * Loads an audio sample from the specified URL.
   * @param url The URL of the audio sample.
   */
  public async loadSample(url: string): Promise<void> {
    const { array } = await audioArrayFromURL(url);
    this.buffer = this.arrayToBuffer(array);
  }

  /**
   * Plays the audio buffer.
   * @param onset The time in seconds when the audio should start playing. Defaults to 0.
   * @param inskip The time in seconds to skip at the beginning of the audio. Defaults to 0.
   * @param rate The playback rate of the audio. Defaults to 1.
   * @param duration The duration of the audio to play. Defaults to undefined (play until the end).
   * @returns The AudioBufferSourceNode used for playback.
   */
  public play(onset: number = 0, inskip: number = 0, rate: number = 1, duration: number | undefined = undefined): AudioBufferSourceNode {
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.playbackRate.value = rate;
    source.start(onset + this.context.currentTime, inskip, duration);
    source.connect(this.gain);
    return source;
  }
}
