import * as Tone from "tone";

export default class AudioSampler {
  private audioFiles: Record<number, Record<"f" | "p", string[]>>;
  private sampleRateRatio: number;

  constructor() {
    this.audioFiles = {};
    this.sampleRateRatio = 1;
  }

  public async loadAudioFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      const fileName = filePath.split("/").pop()!;
      const [pitchStr, dynamic] = fileName.split("-");
      const pitch = parseInt(pitchStr, 10);

      if (!this.audioFiles[pitch]) {
        this.audioFiles[pitch] = { f: [], p: [] };
      }

      this.audioFiles[pitch][dynamic as "f" | "p"].push(filePath);
    }
  }

  public setSampleRateRatio(sampleRateRatio: number): void {
    this.sampleRateRatio = sampleRateRatio;
  }

  public async playNote(pitch: number, velocity: number, duration: number, onset: number): Promise<void> {
    const dynamics = velocity > 0.5 ? ["f", "p"] : ["p", "f"];
    const dynamicFiles = dynamics.map((dynamic) => this.audioFiles[pitch]?.[dynamic as "f" | "p"]).filter((files) => files && files.length > 0);

    if (!dynamicFiles || dynamicFiles.length === 0) {
      throw new Error(`No matching audio files found for pitch ${pitch}.`);
    }

    const closestFile = this.findClosestFile(dynamicFiles, pitch);
    const source = new Tone.Player(closestFile).toDestination();
    source.playbackRate = this.calculatePlaybackRate(pitch, closestFile);
    source.start(Tone.now() + onset);
    source.stop(Tone.now() + onset + duration);
  }

  private findClosestFile(dynamicFiles: (string[] | undefined)[], pitch: number): string {
    const closestDynamics = dynamicFiles.filter((files) => files !== undefined) as string[][];

    if (closestDynamics.length === 1) {
      return closestDynamics[0][0];
    }

    let closestFile = "";
    let closestPitchDiff = Infinity;

    for (const dynamicFiles of closestDynamics) {
      for (const file of dynamicFiles) {
        const filePitch = parseInt(file.split("/").pop()!.split("-")[0], 10);
        const pitchDiff = Math.abs(filePitch - pitch);

        if (pitchDiff < closestPitchDiff) {
          closestPitchDiff = pitchDiff;
          closestFile = file;
        }
      }
    }

    return closestFile;
  }

  private calculatePlaybackRate(targetPitch: number, file: string): number {
    const filePitch = parseInt(file.split("/").pop()!.split("-")[0], 10);
    const semitoneDiff = targetPitch - filePitch;
    const playbackRate = 2 ** (semitoneDiff / 12) * this.sampleRateRatio;

    return playbackRate;
  }
}
