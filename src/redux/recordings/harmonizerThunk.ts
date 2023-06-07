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

const harmonize = createAsyncThunk(
  "recordings/harmonize",
  async (recording: Recording): Promise<void | Pick<Recording, "url" | "duration" | "name">> => {
    try {
      const { array, sampleRate } = await audioArrayFromURL(recording.url);
      const detectedNotes = detectPitch(array, sampleRate);
      const styleList = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);
      const style = styleList[Math.floor(Math.random() * styleList.length)];
      if (detectedNotes.length === 0) {
        return;
      }
      const segSize = (60 / recording.features!.tempo) * 2;
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
            name: `${recording.name} (${style})`,
            duration: recDuration,
            url: URL.createObjectURL(blob),
          };
        });
    } catch (error) {
      console.log(error);
    }
  }
);

export default harmonize;
