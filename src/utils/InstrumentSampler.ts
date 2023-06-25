import { InstrumentName } from "../types/music";
import audioArrayFromURL from "./audioArrayFromURL";

type SampleCollection = Record<number, Record<number, AudioBuffer>>;

export enum DynamicMarking {
  PIANO = "p",
  MEZZOFORTE = "mf",
  FORTE = "f",
}

type InstrumentRecord = Record<
  InstrumentName,
  {
    minPitch: number;
    maxPitch: number;
    pitchIncrement: number;
    dynamics: DynamicMarking[];
  }
>;

const ALL_DYNAMICS = [DynamicMarking.FORTE, DynamicMarking.MEZZOFORTE, DynamicMarking.PIANO];

const INSTRUMENT_RECORD: InstrumentRecord = {
  [InstrumentName.PIANO]: {
    minPitch: 36,
    maxPitch: 90,
    pitchIncrement: 6,
    dynamics: ALL_DYNAMICS,
  },
  [InstrumentName.EPIANO]: {
    minPitch: 36,
    maxPitch: 90,
    pitchIncrement: 6,
    dynamics: ALL_DYNAMICS,
  },
  [InstrumentName.MANDOLIN]: {
    minPitch: 48,
    maxPitch: 72,
    pitchIncrement: 12,
    dynamics: [DynamicMarking.MEZZOFORTE],
  },
  [InstrumentName.GUITAR]: {
    minPitch: 41,
    maxPitch: 83,
    pitchIncrement: 6,
    dynamics: ALL_DYNAMICS,
  },
};

export default class InstrumentSampler {
  private context: OfflineAudioContext;
  private samples: SampleCollection;
  private output: GainNode;
  private envelope: Float32Array;

  constructor(context: OfflineAudioContext) {
    this.context = context;
    this.samples = {};
    this.output = context.createGain();
    this.envelope = new Float32Array([...[...Array(12).keys()].map(() => 1), 0.5, 0.25, 0.125, 0.006, 0.003, 0.0015, 0]);
  }

  public async load(instrumentName: InstrumentName): Promise<void> {
    const urls = this.getAudioUrls(instrumentName);
    const promises = urls.map((url) => {
      return new Promise<void>(async (resolve, reject) => {
        const matches = this.retrievePitchAndDynamic(url);
        if (!matches) {
          return;
        }
        const [pitch, dynamic] = matches;
        const velocity = this.dynamicToVelocity(dynamic);
        try {
          const { array } = await audioArrayFromURL(url);
          const sample = this.arrayToBuffer(array);
          if (!this.samples[pitch]) {
            this.samples[pitch] = { [velocity]: sample };
          } else {
            this.samples[pitch] = { ...this.samples[pitch], [velocity]: sample };
          }
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          resolve();
        }
      });
    });
    await Promise.all(promises);
  }

  public playNote(onset: number, pitch: number, velocity: number, duration: number): AudioBufferSourceNode | undefined {
    const { buffer, sourcePitch } = this.findBuffer(pitch, velocity);

    // get playback rate
    const playbackRate = 2 ** ((pitch - sourcePitch) / 12);

    // don't play notes that require resampling below or above an octave
    if (playbackRate > 2 || playbackRate < 0.5) {
      return undefined;
    }

    // create envelope
    const env = this.context.createGain();

    // create contant note amplitude and set to velocity
    const amp = this.context.createGain();
    amp.gain.value = velocity;

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
    panner.connect(this.output);

    source.start(startTime);
    source.stop(startTime + noteDuration + 1);

    return source;
  }

  public arrayToBuffer(array: Float32Array): AudioBuffer {
    const buffer = this.context.createBuffer(1, array.length, this.context.sampleRate);
    buffer.getChannelData(0).set(array);
    return buffer;
  }

  public dynamicToVelocity(dynamic: DynamicMarking) {
    return {
      [DynamicMarking.PIANO]: 1 / 3,
      [DynamicMarking.MEZZOFORTE]: 2 / 3,
      [DynamicMarking.FORTE]: 1,
    }[dynamic];
  }

  private retrievePitchAndDynamic(url: string): [number, DynamicMarking] | null {
    const filename = url.split("/").pop(); // Extract the file name from the URL
    if (!filename) return null; // No file name found

    const regex = /(\d+)-([a-zA-Z]+)\.mp3/; // Regular expression to match the pitch and dynamic
    const matches = regex.exec(filename);

    if (matches && matches.length >= 3) {
      const pitch = parseInt(matches[1], 10);
      const dynamic = matches[2] as DynamicMarking;
      return [pitch, dynamic];
    }

    return null; // No matches found
  }

  public connect(node: AudioNode): void {
    this.output.connect(node);
  }

  public disconnect() {
    this.output.disconnect();
  }

  public getAudioUrls(instrumentName: InstrumentName): string[] {
    const urls: string[] = [];
    const { minPitch, maxPitch, pitchIncrement, dynamics } = INSTRUMENT_RECORD[instrumentName];
    let pitch = minPitch;

    while (pitch <= maxPitch) {
      dynamics.forEach((dynamic) => {
        urls.push(`https://dxbtnxd6vjk30.cloudfront.net/instruments/${instrumentName}/${pitch}-${dynamic}.mp3`);
      });
      pitch += pitchIncrement;
    }

    return urls;
  }

  private findBuffer(pitch: number, velocity: number): { buffer: AudioBuffer; sourcePitch: number } {
    const pitchKeys = Object.keys(this.samples as SampleCollection).map(Number);
    pitchKeys.sort();
    const closestPitch = this.binarySearchClosest(pitchKeys, pitch);

    const buffersByVelocity = this.samples[closestPitch];
    const velocityKeys = Object.keys(buffersByVelocity).map(Number);
    velocityKeys.sort();
    const closestVelocity = this.binarySearchClosest(velocityKeys, velocity);

    return { buffer: buffersByVelocity[closestVelocity], sourcePitch: closestPitch };
  }

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
