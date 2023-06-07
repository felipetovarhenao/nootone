import AudioSampler from "./AudioSampler";

import note1 from "../assets/audio/guitar/48-p.ogg";
import note2 from "../assets/audio/guitar/48-f.ogg";
import note3 from "../assets/audio/guitar/54-p.ogg";
import note4 from "../assets/audio/guitar/54-f.ogg";
import note5 from "../assets/audio/guitar/72-p.ogg";
import note6 from "../assets/audio/guitar/72-f.ogg";
import note7 from "../assets/audio/guitar/78-f.ogg";
import note9 from "../assets/audio/guitar/78-p.ogg";
import note10 from "../assets/audio/guitar/60-p.ogg";
import note11 from "../assets/audio/guitar/60-f.ogg";
import note12 from "../assets/audio/guitar/42-f.ogg";
import note13 from "../assets/audio/guitar/66-p.ogg";
import note14 from "../assets/audio/guitar/66-f.ogg";
import note15 from "../assets/audio/guitar/42-p.ogg";
import { NoteEvent } from "./playNoteEvents";
import renderAudioOffline from "./renderAudioOffline";
import createNewAudioContext from "./createNewAudioContext";
import audioArrayFromURL from "./audioArrayFromURL";
import reverbURL from "../assets/audio/impulseResponses/Large_bottle_hall.mp3";

const GUITAR_NOTES = [note1, note2, note3, note4, note5, note6, note7, note9, note10, note11, note12, note13, note14, note15];

export default class SamplerRenderer {
  public static async renderNoteEventsCallback(audioContext: OfflineAudioContext, noteEvents: NoteEvent[]) {
    const sampler = new AudioSampler(audioContext);
    return sampler.loadSamples(GUITAR_NOTES).then(() => {
      noteEvents.forEach((note) => {
        sampler.playNote(note.onset, note.pitch, note.velocity || 0.5, note.duration);
      });
    });
  }

  public static async renderNoteEvents(noteEvents: NoteEvent[], url: string): Promise<AudioBuffer> {
    const ctx = createNewAudioContext();
    const { array } = await audioArrayFromURL(url, ctx.sampleRate);
    let lastNoteOutset = 0;
    noteEvents.forEach((note) => {
      lastNoteOutset = Math.max(lastNoteOutset, note.onset + note.duration);
    });

    const totalDuration = Math.max(array.length, Math.ceil(ctx.sampleRate * lastNoteOutset)) + 2 * ctx.sampleRate;
    return renderAudioOffline(
      async (audioContext) => {
        const audioBuffer = audioContext.createBuffer(1, array.length, audioContext.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        channelData.set(array);
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        const reverb = audioContext.createConvolver();
        const reverbGain = audioContext.createGain();
        reverbGain.gain.value = 0.1;
        await audioArrayFromURL(reverbURL).then(({ array }) => {
          reverb.buffer = new AudioSampler().arrayToBuffer(array);
        });
        sourceNode.connect(reverb);
        sourceNode.connect(audioContext.destination);
        reverb.connect(reverbGain);
        reverbGain.connect(audioContext.destination);

        // Start playback
        sourceNode.start(0);
        return SamplerRenderer.renderNoteEventsCallback(audioContext, noteEvents);
      },
      ctx.sampleRate,
      totalDuration
    );
  }
}
