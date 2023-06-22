import AudioSampler from "./AudioSampler";
import { InstrumentName, NoteEvent } from "../types/music";
import renderAudioOffline from "./renderAudioOffline";
import createNewAudioContext from "./createNewAudioContext";
import audioArrayFromURL from "./audioArrayFromURL";
import reverbURL from "../assets/audio/impulseResponses/Five_columns_long.mp3";
import generateAudioUrls from "./generateAudioUrls";

const INSTRUMENTS = {
  guitar: generateAudioUrls(InstrumentName.GUITAR, 42, 68),
  piano: generateAudioUrls(InstrumentName.PIANO, 21, 99),
};

export default class SamplerRenderer {
  public static async renderNoteEventsCallback(audioContext: OfflineAudioContext, noteEvents: NoteEvent[], instrumentName: InstrumentName) {
    const sampler = new AudioSampler(audioContext);
    return sampler.loadSamples(INSTRUMENTS[instrumentName]).then(() => {
        noteEvents.forEach((note) => {
          sampler.playNote(note.onset, note.pitch, note.velocity || 1, note.duration + 0.1);
        });
    });
  }

  public static async renderNoteEvents(
    noteEvents: NoteEvent[],
    url: string,
    instrumentName: InstrumentName = InstrumentName.PIANO
  ): Promise<AudioBuffer> {
    const ctx = createNewAudioContext();
    const { array } = await audioArrayFromURL(url, ctx.sampleRate);
    let lastNoteOutset = 0;
    noteEvents.forEach((note) => {
      lastNoteOutset = Math.max(lastNoteOutset, note.onset + note.duration);
    });

    const totalDuration = Math.max(array.length, Math.ceil(ctx.sampleRate * lastNoteOutset)) + ctx.sampleRate * 2;
    return renderAudioOffline(
      async (audioContext) => {
        const audioBuffer = audioContext.createBuffer(1, array.length, audioContext.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        channelData.set(array);
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        const reverb = audioContext.createConvolver();
        const reverbGain = audioContext.createGain();
        reverbGain.gain.value = 0.125;
        await audioArrayFromURL(reverbURL).then(({ array }) => {
          reverb.buffer = new AudioSampler().arrayToBuffer(array);
        });
        sourceNode.connect(reverb);
        sourceNode.connect(audioContext.destination);
        reverb.connect(reverbGain);
        reverbGain.connect(audioContext.destination);

        // Start playback
        sourceNode.start(0);
        return SamplerRenderer.renderNoteEventsCallback(audioContext, noteEvents, instrumentName);
      },
      ctx.sampleRate,
      totalDuration
    );
  }
}
