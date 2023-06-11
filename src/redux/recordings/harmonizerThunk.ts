import { createAsyncThunk } from "@reduxjs/toolkit";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import noteEventsToChordEvents from "../../utils/noteEventsToChordEvents";
import audioBufferToBlob from "../../utils/audioBufferToBlob";
import getAudioDuration from "../../utils/getAudioDuration";
import SamplerRenderer from "../../utils/SamplerRenderer";
import { NoteEvent } from "../../types/music";
import { Recording } from "../../types/audio";
import detectPitch from "../../utils/detectPitch";
import Arpeggiator from "../../utils/Arpeggiator";
import chordEventsToNoteEvents from "../../utils/chordEventsToNoteEvents";

type HarmonizerPayload = {
  recording: Recording;
  settings: {
    style: string;
  };
};

export type HarmonizerReturnType = {
  variation: Omit<Recording, "variations">;
  noteEvents: NoteEvent[];
};

/**
 * Harmonizes a recording by applying various musical transformations and generating harmonized variations.
 *
 * @param recording - The recording to harmonize.
 * @returns A Promise that resolves to the harmonized recording.
 */
const harmonize = createAsyncThunk("recordings/harmonize", async (payload: HarmonizerPayload): Promise<void | HarmonizerReturnType> => {
  const { recording, settings } = payload;
  try {
    // Retrieve the audio array and sample rate from the recording URL
    const { array, sampleRate } = await audioArrayFromURL(recording.url);

    // Detect the pitches of the recorded notes or use the pre-computed note events
    const detectedNotes = recording.features.noteEvents || detectPitch(array, sampleRate);

    if (detectedNotes.length === 0) {
      return;
    }

    // Calculate the segment size based on the tempo (default to 60 BPM if not provided)
    const segSize = (60 / recording.features.tempo! || 60) * 2;

    // Harmonize the detected notes using the NoteHarmonizer class
    const harmonicBlocks = new NoteHarmonizer().harmonize(
      detectedNotes.map((n) => ({ ...n, velocity: 1 })),
      settings.style,
      segSize
    );

    // Generate the individual note events from the harmonic blocks and apply voice leading
    const notes: NoteEvent[] = [];
    const chordProgression = applyVoiceLeading(harmonicBlocks.map((chord) => chord.notes.map((note) => note.pitch)));

    chordProgression.forEach((chord: number[], i) =>
      chord.sort().forEach((pitch: number) => notes.push({ pitch: pitch, onset: harmonicBlocks[i].onset, duration: segSize, velocity: 1 }))
    );

    // Convert the note events into chord events and arpeggiate the chords
    const chords = noteEventsToChordEvents(notes);

    const config = Arpeggiator.genRandomConfig();
    const arpeggios = chordEventsToNoteEvents(
      Arpeggiator.arpeggiate(chords, config.numAttacks, config.maxSubdiv, config.patternSize, config.contourSize, recording.features.tempo!)
    );

    // Update the features of the recording
    const features = {
      ...recording.features,
      noteEvents: detectedNotes.map((n) => ({ ...n, velocity: 0.707 })),
    };

    // Render the arpeggios as audio and convert the resulting audio buffer to a Blob
    return SamplerRenderer.renderNoteEvents(arpeggios, recording.url)
      .then((audioBuffer) => audioBufferToBlob(audioBuffer, sampleRate))
      .then(async (blob) => {
        // Calculate the duration of the harmonized recording
        const recDuration = await getAudioDuration(blob);

        // Create a new harmonized variation of the recording
        return {
          noteEvents: features.noteEvents,
          variation: {
            name: `${recording.name} (${settings.style} 🪕)`,
            duration: recDuration,
            date: JSON.stringify(new Date()),
            url: URL.createObjectURL(blob),
            tags: [...recording.tags, settings.style],
            features: { ...features, chordEvents: harmonicBlocks },
          },
        };
      });
  } catch (error: unknown) {
    console.log(error);
  }
});

export default harmonize;
