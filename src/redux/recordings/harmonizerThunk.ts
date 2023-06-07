import { createAsyncThunk } from "@reduxjs/toolkit";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import detectPitch from "../../utils/detectPitch";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import noteEventsToChordEvents from "../../utils/groupNoteEventsByOnset";
import arpeggiateChords from "../../utils/arpeggiateChords";
import audioBufferToBlob from "../../utils/audioBufferToBlob";
import getAudioDuration from "../../utils/getAudioDuration";
import SamplerRenderer from "../../utils/SamplerRenderer";
import { NoteEvent } from "../../types/music";
import { Recording } from "../../types/audio";

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
    const chords = new NoteHarmonizer().harmonize(
      detectedNotes.map((n) => ({ velocity: 0.5, ...n })),
      style,
      segSize
    );
    let onsetOffset = Math.min(...chords.map((chord) => chord.onset));

    const notes: NoteEvent[] = [];
    const progression = applyVoiceLeading(chords.map((chord) => chord.notes.map((note) => note.pitch)));

    progression.forEach((chord: number[], i) =>
      chord.sort().forEach((pitch: number) => notes.push({ pitch: pitch, onset: onsetOffset + i * segSize, duration: segSize, velocity: 1 }))
    );
    const chords2 = noteEventsToChordEvents(notes);
    const arpeggios = arpeggiateChords(chords2);

    return SamplerRenderer.renderNoteEvents(arpeggios, recording.url)
      .then((audioBuffer) => audioBufferToBlob(audioBuffer))
      .then(async (blob) => {
        const recDuration = await getAudioDuration(blob);
        return {
          ...recording,
          variations: [
            ...(recording.variations || []),
            {
              name: `${recording.name} (${style})`,
              duration: recDuration,
              date: JSON.stringify(new Date()),
              url: URL.createObjectURL(blob),
              tags: [...recording.tags, style],
              features: {
                ...recording.features,
                noteEvents: detectedNotes.map((n) => ({ ...n, velocity: 0.707 })),
              },
            },
          ],
        };
      });
  } catch (error) {
    console.log(error);
  }
});

export default harmonize;
