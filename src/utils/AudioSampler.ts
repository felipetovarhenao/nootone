import audioArrayFromURL from "./audioArrayFromURL";
import reverbURL from "../assets/audio/impulseResponses/Large_bottle_hall.mp3";
import AudioSource from "./AudioSource";
/**
 * A class representing a sampler instrument that can load and play audio samples.
 */
type Sample = Record<number, AudioBuffer>;
type MultiSample = Record<number, Sample>;

export default class AudioSampler extends AudioSource {
  private samples: MultiSample;
  private reverb: ConvolverNode;
  private masterGain: GainNode;

  /**
   * Creates an instance of the AudioSampler class.
   * @param context The AudioContext used for audio processing.
   */
  constructor(context?: AudioContext, preconnect: boolean = true) {
    super(context, preconnect);
    this.samples = {};

    // Create and connect the reverb effect node
    this.reverb = this.context.createConvolver();
    audioArrayFromURL(reverbURL, (audioData, _) => {
      this.reverb.buffer = this.arrayToBuffer(audioData);
    });

    // Create and connect the master gain node
    this.masterGain = this.context.createGain();
    this.reverb.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
  }

  /**
   * Loads audio samples from the provided URLs.
   * @param samples An array of sample URLs to load.
   * @returns A promise that resolves when all samples are loaded.
   */
  public async loadSamples(samples: string[]): Promise<void> {
    const promises = samples.map((sampleURL) => {
      return new Promise<void>((resolve, reject) => {
        const [pitch, dynamic] = parseFileName(sampleURL);
        const velocity = dynamic == "f" ? 1.0 : 0.5;

        audioArrayFromURL(
          sampleURL,
          (audioData, _) => {
            const sample = this.arrayToBuffer(audioData);
            if (!this.samples[pitch]) {
              this.samples[pitch] = { [velocity]: sample };
            } else {
              this.samples[pitch] = { ...this.samples[pitch], [velocity]: sample };
            }
            resolve(); // Resolve the promise when the callback is called
          },
          (error) => {
            reject(error); // Reject the promise if there's an error
          },
          this.context.sampleRate
        );
      });
    });
    await Promise.all(promises); // Wait for all promises to resolve
  }

  /**
   * Returns the loaded samples.
   * @returns The loaded samples.
   */
  public getSamples(): MultiSample {
    return this.samples;
  }

  /**
   * Plays a note with the specified pitch and velocity at the given onset time.
   * @param onset The onset time in seconds.
   * @param pitch The pitch value of the note.
   * @param velocity The velocity value of the note.
   */
  public playNote(onset: number, pitch: number, velocity: number): AudioBufferSourceNode | undefined {
    const { buffer, sourcePitch } = this.findBuffer(pitch, velocity);
    const playbackRate = 2 ** ((pitch - sourcePitch) / 12);
    if (playbackRate > 2 || playbackRate < 0.5) {
      return undefined;
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;

    const dryMix = this.context.createGain();
    dryMix.gain.value = velocity;

    const wetMix = this.context.createGain();
    wetMix.gain.value = 0.125 * velocity;

    const panner = this.context.createStereoPanner();
    panner.pan.value = Math.min(1, Math.max(0, (pitch / 127) * 2 - 1));
    source.connect(panner);

    panner.connect(wetMix);
    panner.connect(dryMix);
    dryMix.connect(this.masterGain);
    wetMix.connect(this.reverb);
    source.start(this.context.currentTime + onset);
    return source;
  }

  /**
   * Finds the closest buffer for the specified pitch and velocity.
   * @param pitch The pitch value to search for.
   * @param velocity The velocity value to search for.
   * @returns An object containing the closest buffer and the source pitch.
   */
  private findBuffer(pitch: number, velocity: number): { buffer: AudioBuffer; sourcePitch: number } {
    const pitchKeys = Object.keys(this.samples as MultiSample).map(Number);
    pitchKeys.sort();
    const closestPitch = this.binarySearchClosest(pitchKeys, pitch);

    const buffersByVelocity = this.samples[closestPitch];
    const velocityKeys = Object.keys(buffersByVelocity).map(Number);
    velocityKeys.sort();
    const closestVelocity = this.binarySearchClosest(velocityKeys, velocity);

    return { buffer: buffersByVelocity[closestVelocity], sourcePitch: closestPitch };
  }

  /**
   * Performs a binary search to find the closest value in the array to the target value.
   * @param arr The array to search in.
   * @param target The target value to search for.
   * @returns The closest value in the array to the target value.
   */
  private binarySearchClosest(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    let closest = arr[left];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const current = arr[mid];

      if (Math.abs(target - current) < Math.abs(target - closest)) {
        closest = current;
      }

      if (current < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return closest;
  }
}

function parseFileName(filePath: string): [number, string] {
  // Extract the file name from the full path
  const fileName = filePath.split("/").pop()!;

  // Extract the initial number using a regular expression
  const numberMatch = fileName.match(/^(\d+)-/);
  const initialNumber = parseInt(numberMatch![1]);

  // Extract the letter following the number
  const letter = fileName.charAt(numberMatch![0].length);

  return [initialNumber, letter];
}
