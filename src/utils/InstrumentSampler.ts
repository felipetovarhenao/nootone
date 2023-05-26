import * as Tone from "tone";

type SampleMap = {
  [pitch: number]: string;
};

export default class InstrumentSampler {
  private sampler: Tone.Sampler;
  constructor(sampleMap: SampleMap, baseURL: string) {
    this.sampler = new Tone.Sampler(sampleMap, undefined, baseURL);
    this.sampler.toDestination();
  }

  public playNote(pitch: number | number[], onset?: Tone.Unit.Time | undefined, velocity: number = 0.5) {
    this.sampler.triggerAttack(pitch, onset, velocity);
  }
}
