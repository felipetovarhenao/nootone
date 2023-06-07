import { createAsyncThunk } from "@reduxjs/toolkit";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import noteEventsToChordEvents from "../../utils/groupNoteEventsByOnset";
import arpeggiateChords from "../../utils/arpeggiateChords";
import audioBufferToBlob from "../../utils/audioBufferToBlob";
import getAudioDuration from "../../utils/getAudioDuration";
import SamplerRenderer from "../../utils/SamplerRenderer";
import { NoteEvent } from "../../types/music";
import { Recording } from "../../types/audio";
import detectPitch from "../../utils/detectPitch";

const harmonize = createAsyncThunk("recordings/harmonize", async (recording: Recording): Promise<void | Recording> => {
  try {
    const { array, sampleRate } = await audioArrayFromURL(recording.url);
    const detectedNotes = recording.features.noteEvents || detectPitch(array, sampleRate);
    const styleList = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);
    const style = styleList[Math.floor(Math.random() * styleList.length)];
    if (detectedNotes.length === 0) {
      return;
    }

    const segSize = (60 / recording.features.tempo! || 60) * 2;
    const harmonicBlocks = new NoteHarmonizer().harmonize(
      detectedNotes.map((n) => ({ ...n, velocity: 1 })),
      style,
      segSize
    );

    const notes: NoteEvent[] = [];
    const chordProgression = applyVoiceLeading(harmonicBlocks.map((chord) => chord.notes.map((note) => note.pitch)));

    chordProgression.forEach((chord: number[], i) =>
      chord.sort().forEach((pitch: number) => notes.push({ pitch: pitch, onset: harmonicBlocks[i].onset, duration: segSize, velocity: 1 }))
    );
    const chords = noteEventsToChordEvents(notes);
    const arpeggios = arpeggiateChords(chords);
    const features = {
      ...recording.features,
      noteEvents: detectedNotes.map((n) => ({ ...n, velocity: 0.707 })),
    };

    return SamplerRenderer.renderNoteEvents(arpeggios, recording.url)
      .then((audioBuffer) => audioBufferToBlob(audioBuffer))
      .then(async (blob) => {
        const recDuration = await getAudioDuration(blob);
        return {
          ...recording,
          features: features,
          variations: [
            ...(recording.variations || []),
            {
              name: `${recording.name} (${style})`,
              duration: recDuration,
              date: JSON.stringify(new Date()),
              url: URL.createObjectURL(blob),
              tags: [...recording.tags, style],
              features: { ...features, chordEvents: harmonicBlocks },
            },
          ],
        };
      });
  } catch (error: unknown) {
    console.log(error);
  }
});

export default harmonize;