import audioArrayFromURL from "./audioArrayFromURL";
import reverbURL from "../assets/audio/impulseResponses/Five_columns_long.mp3";
import AudioSource from "./AudioSource";
/**
 * A class representing a sampler instrument that can load and play audio samples.
 */
type Sample = Record<number, AudioBuffer>;
type MultiSample = Record<number, Sample>;

export default class AudioSampler extends AudioSource {
  private samples: MultiSample;
  private reverb: ConvolverNode;
  private reverbGain: GainNode;
  private masterGain: GainNode;
  private envelope: Float32Array;

  /**
   * Creates an instance of the AudioSampler class.
   * @param context The AudioContext used for audio processing.
   */
  constructor(context?: AudioContext | OfflineAudioContext, preconnect: boolean = true) {
    super(context, preconnect);
    this.samples = {};

    // create default note envelope
    this.envelope = new Float32Array([...[...Array(12).keys()].map(() => 1), 0.5, 0.25, 0.125, 0.006, 0.003, 0.0015, 0]);

    // Create and connect the master gain node
    this.masterGain = this.context.createGain();

    // Create reverb node and load impulse response
    this.reverb = this.context.createConvolver();
    audioArrayFromURL(reverbURL).then(({ array }) => {
      this.reverb.buffer = this.arrayToBuffer(array);
    });

    // create reverb gain node
    this.reverbGain = this.context.createGain();
    this.reverbGain.gain.value = 0.2;

    // Node connexions
    this.masterGain.connect(this.reverb);
    this.reverb.connect(this.reverbGain);
    this.reverbGain.connect(this.context.destination);
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

        audioArrayFromURL(sampleURL).then(
          ({ array }) => {
            const sample = this.arrayToBuffer(array);
            if (!this.samples[pitch]) {
              this.samples[pitch] = { [velocity]: sample };
            } else {
              this.samples[pitch] = { ...this.samples[pitch], [velocity]: sample };
            }
            resolve(); // Resolve the promise when the callback is called
          },
          (error) => {
            reject(error); // Reject the promise if there's an error
          }
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
  public playNote(onset: number, pitch: number, velocity: number, duration: number): AudioBufferSourceNode | undefined {
    const { buffer, sourcePitch } = this.findBuffer(pitch, velocity);

    // get playback rate
    const playbackRate = 2 ** ((pitch - sourcePitch) / 12);
    if (playbackRate > 2 || playbackRate < 0.5) {
      return undefined;
    }
    // create envelope
    const env = this.context.createGain();

    const amp = this.context.createGain();
    amp.gain.value = Math.random() * 0.25 + 0.75;

    // create source node
    const source = this.context.createBufferSource();
    source.buffer = buffer;

    // retune
    source.playbackRate.value = playbackRate;

    // get note duration
    const noteDuration = Math.min(source.buffer.duration, duration * playbackRate + 0.12);
    const startTime = this.context.currentTime + onset;
    env.gain.setValueCurveAtTime(this.envelope, startTime, noteDuration);

    const panner = this.context.createStereoPanner();
    panner.pan.value = Math.sin((pitch / 127) * Math.PI * 4) * 0.5;

    source.connect(amp);
    amp.connect(env);
    env.connect(panner);
    panner.connect(this.masterGain);

    source.start(startTime);
    source.stop(startTime + noteDuration + 1);

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
