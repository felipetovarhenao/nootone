import * as Tone from "tone";
import { AudioTrack, SymbolicTrack, TrackSequence, TrackType } from "../types/audio";
import audioArrayFromURL from "./audioArrayFromURL";
import audioBufferToBlob from "./audioBufferToBlob";
import InstrumentSampler from "./InstrumentSampler";
import randomChoice from "./randomChoice";

const IMPULSE_RESPONSES = [
  "Five_columns_long",
  "Scala_milan_opera_hall",
  "Right_glass_triangle",
  "Musikvereinsaal",
  "Large_bottle_hall",
  "In_the_silo",
  "Going_home",
  "Conic_long_echo_hall",
  "Cement_blocks_2",
  "Five_columns_long",
];

export default class AudioRenderer {
  public static async render(tracks: TrackSequence, numChannels: number = 2): Promise<Blob> {
    const outputDuration = this.getOutputDuration(tracks) + 1.5;
    const sampleRate = Tone.context.sampleRate;
    const context = new OfflineAudioContext(numChannels, sampleRate * outputDuration, sampleRate);

    const outputNode = await this.createOutputNode(context);

    for (let i = 0; i < tracks.length; i++) {
      await this.playTrack(outputNode, tracks[i]);
    }
    const buffer = await context.startRendering();
    return audioBufferToBlob(buffer, sampleRate, true, 0.001, -6);
  }

  private static async playTrack(outputNode: GainNode, track: AudioTrack | SymbolicTrack) {
    switch (track.type) {
      case TrackType.AUDIO:
        await this.playAudioTrack(outputNode, track);
        break;
      case TrackType.SYMBOLIC:
        await this.playSymbolicTrack(outputNode, track);
        break;
      default:
        break;
    }
  }

  private static async playAudioTrack(outputNode: GainNode, track: AudioTrack) {
    const context = outputNode.context as OfflineAudioContext;
    const { array } = await audioArrayFromURL(track.data.url, context.sampleRate);
    const audioBuffer = context.createBuffer(1, array.length, context.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(array);
    const sourceNode = context.createBufferSource();
    const gain = context.createGain();

    sourceNode.buffer = audioBuffer;
    gain.gain.value = track.config?.gain || 1;

    sourceNode.connect(gain);
    gain.connect(outputNode);

    sourceNode.start(track.data.onset);
  }

  private static async playSymbolicTrack(outputNode: GainNode, track: SymbolicTrack) {
    const context = outputNode.context as OfflineAudioContext;

    const sampler = new InstrumentSampler(context);
    await sampler.load(track.data.name);
    if (track.config) {
      sampler.setGain(track.config.gain || 1);
    }

    track.data.chordEvents.forEach((chord) =>
      chord.notes.forEach((note) => sampler.playNote(chord.onset, note.pitch, note.velocity || 1, note.duration + 0.1))
    );
    sampler.connect(outputNode);
  }

  private static arrayToBuffer(context: OfflineAudioContext, array: Float32Array): AudioBuffer {
    const buffer = context.createBuffer(1, array.length, context.sampleRate);
    buffer.getChannelData(0).set(array);
    return buffer;
  }

  private static async createOutputNode(context: OfflineAudioContext): Promise<GainNode> {
    // all nodes to be rendered will be connect to this node
    const outputNode = context.createGain();

    const desinationGain = context.createGain();

    /* reverb FX */
    const reverbGain = context.createGain();

    const impulseResponse = randomChoice(IMPULSE_RESPONSES);
    const reverbConvolver = await this.createConvolver(context, `https://dxbtnxd6vjk30.cloudfront.net/impulseResponses/${impulseResponse}.mp3`);
    reverbGain.gain.value = 0.15;

    const compressorNode = this.createCompressorNode(context);

    /* node graph */
    outputNode.connect(compressorNode);
    compressorNode.connect(reverbConvolver);
    reverbConvolver.connect(reverbGain);

    compressorNode.connect(desinationGain);
    reverbGain.connect(desinationGain);

    desinationGain.connect(context.destination);

    return outputNode;
  }

  private static createCompressorNode(context: OfflineAudioContext) {
    const compressorNode = context.createDynamicsCompressor();
    compressorNode.threshold.value = -12;
    compressorNode.knee.value = 8;
    compressorNode.ratio.value = 12;
    compressorNode.attack.value = 0.08;
    compressorNode.release.value = 0.2;
    return compressorNode;
  }

  private static async createConvolver(context: OfflineAudioContext, url: string): Promise<ConvolverNode> {
    const convolver = context.createConvolver();
    const { array } = await audioArrayFromURL(url);
    const buffer = this.arrayToBuffer(context, array);
    convolver.buffer = buffer;
    return convolver;
  }

  private static getOutputDuration(tracks: TrackSequence): number {
    let totalDuration = 0;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      switch (track.type) {
        case TrackType.AUDIO:
          totalDuration = Math.max(track.data.duration + (track.data.onset || 0), totalDuration);
          break;
        case TrackType.SYMBOLIC:
          track.data.chordEvents.forEach((chord) =>
            chord.notes.forEach((note) => (totalDuration = Math.max(totalDuration, note.duration + chord.onset)))
          );
      }
    }
    return totalDuration;
  }
}
