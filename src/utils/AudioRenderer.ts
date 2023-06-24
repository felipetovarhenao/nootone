import * as Tone from "tone";
import { AudioTrack, SymbolicTrack, TrackSequence, TrackType } from "../types/audio";
import getAudioDuration from "./getAudioDuration";
import AudioSampler from "./AudioSampler";
import audioArrayFromURL from "./audioArrayFromURL";
import reverbUrl from "../assets/audio/impulseResponses/Five_columns_long.mp3";
import generateAudioUrls from "./generateAudioUrls";
import { InstrumentName } from "../types/music";
import audioBufferToBlob from "./audioBufferToBlob";

const INSTRUMENTS = {
  guitar: generateAudioUrls(InstrumentName.GUITAR, 42, 68),
  piano: generateAudioUrls(InstrumentName.PIANO, 21, 99),
};

export default class AudioRenderer {
  public static async render(tracks: TrackSequence, numChannels: number = 2): Promise<Blob> {
    const outputDuration = (await this.getOutputDuration(tracks)) + 1.5;
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
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(outputNode);
    sourceNode.start(track.data.onset);
  }

  private static async playSymbolicTrack(outputNode: GainNode, track: SymbolicTrack) {
    const context = outputNode.context as OfflineAudioContext;
    const sampler = new AudioSampler(context, false);
    await sampler.loadSamples(INSTRUMENTS[track.data.name]);
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
    const reverbConvolver = await this.createConvolver(context, reverbUrl);
    reverbGain.gain.value = 0.125;

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
    compressorNode.threshold.value = -45;
    compressorNode.knee.value = 10;
    compressorNode.ratio.value = 20;
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

  private static async getOutputDuration(tracks: TrackSequence): Promise<number> {
    let totalDuration = 0;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      switch (track.type) {
        case TrackType.AUDIO:
          try {
            const res = await fetch(track.data.url);
            const blob = await res.blob();
            const duration = await getAudioDuration(blob);
            totalDuration = Math.max(duration + track.data.onset, totalDuration);
          } catch (err) {
            console.log(err);
          }
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
