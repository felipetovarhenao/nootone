import { createAsyncThunk } from "@reduxjs/toolkit";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import noteEventsToChordEvents from "../../utils/noteEventsToChordEvents";
import audioBufferToBlob from "../../utils/audioBufferToBlob";
import getAudioDuration from "../../utils/getAudioDuration";
import SamplerRenderer from "../../utils/SamplerRenderer";
import { InstrumentName, NoteEvent } from "../../types/music";
import { Recording } from "../../types/audio";
import detectPitch from "../../utils/detectPitch";
import Arpeggiator from "../../utils/Arpeggiator";
import chordEventsToNoteEvents from "../../utils/chordEventsToNoteEvents";
import generateRandomNoteEvents from "../../utils/generateRandomNoteEvents";
import randomChoice from "../../utils/randomChoice";
import getRandomNumber from "../../utils/getRandomNumber";

export type HarmonizerSettings = {
  style: string;
  patternSize: number;
  segSizes: number[];
  numAttacksRange: [number, number];
  maxSubdiv: number;
  instrumentName: InstrumentName;
};

type HarmonizerPayload = {
  recording: Recording;
  settings: HarmonizerSettings;
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
    let detectedNotes = recording.features.noteEvents || detectPitch(array, sampleRate);

    // let didDetectionFailed = false;
    if (detectedNotes.length === 0) {
      // didDetectionFailed = true;
      detectedNotes = generateRandomNoteEvents(recording.duration, payload.recording.features.tempo!);
    }

    // Calculate the segmenƒt size based on the tempo (default to 60 BPM if not provided)
    const segSize = (60 / recording.features.tempo! || 60) * randomChoice(settings.segSizes)!;

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

    const config = Arpeggiator.genRandomConfig({
      patternSize: settings.patternSize,
      numAttacks: getRandomNumber(...settings.numAttacksRange),
      maxSubdiv: settings.maxSubdiv,
    });

    const arpeggios = chordEventsToNoteEvents(
      Arpeggiator.arpeggiate(chords, config.numAttacks, config.maxSubdiv, config.patternSize, config.contourSize, recording.features.tempo!)
    );

    // Update the features of the recording
    const features = {
      ...recording.features,
      noteEvents: detectedNotes.map((n) => ({ ...n, velocity: 0.707 })),
    };

    // Render the arpeggios as audio and convert the resulting audio buffer to a Blob
    const audioBuffer = await SamplerRenderer.renderNoteEvents(arpeggios, recording.url, settings.instrumentName as InstrumentName);

    const renderedBlob = audioBufferToBlob(audioBuffer, sampleRate, true, 0.001, -6);

    const recDuration = await getAudioDuration(renderedBlob);

    return {
      noteEvents: features.noteEvents,
      variation: {
        name: `${recording.name} (${settings.style} ${settings.instrumentName === InstrumentName.PIANO ? "🎹" : "🪕"})`,
        duration: recDuration,
        date: JSON.stringify(new Date()),
        url: URL.createObjectURL(renderedBlob),
        tags: [...recording.tags, settings.style],
        features: {
          ...features,
          chordEvents: [
            // ...(!didDetectionFailed ? noteEventsToChordEvents(detectedNotes.map((note) => ({ ...note, velocity: 0.707 }))) : []),
            ...noteEventsToChordEvents(arpeggios),
          ],
        },
      },
    };
  } catch (error: unknown) {
    console.log(error);
  }
});

export default harmonize;
