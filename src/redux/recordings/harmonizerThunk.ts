import { createAsyncThunk } from "@reduxjs/toolkit";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import noteEventsToChordEvents from "../../utils/noteEventsToChordEvents";
import getAudioDuration from "../../utils/getAudioDuration";
import { ChordEvent, InstrumentName, NoteEvent } from "../../types/music";
import { Recording, TrackSequence, TrackType } from "../../types/audio";
import extractAudioFeatures from "../../utils/extractAudioFeatures";
import Arpeggiator from "../../utils/Arpeggiator";
import generateRandomNoteEvents from "../../utils/generateRandomNoteEvents";
import randomChoice from "../../utils/randomChoice";
import AudioRenderer from "../../utils/AudioRenderer";
import applyRmsToChordEvents from "../../utils/applyRmsToChordEvents";

export type HarmonizerSettings = {
  style: string;
  patternSize: number;
  segSizes: number[];
  rhythmicComplexity: { min: number; max: number };
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
    let detectedNotes = recording.features.noteEvents;
    let rms = recording.features.rms;
    if (!detectedNotes || !rms) {
      const { noteEvents, rms: rmsArray, hopSize } = extractAudioFeatures(array, sampleRate);
      detectedNotes = noteEvents.map((n) => ({ ...n, velocity: 1 }));
      rms = { hopSize: hopSize, data: rmsArray };
    }

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

    const maxAttacks = settings.patternSize * settings.maxSubdiv;

    const { min: minComplexity, max: maxComplexity } = settings.rhythmicComplexity;
    const numAttacks = Math.ceil(maxAttacks * (Math.random() * (maxComplexity - minComplexity) + minComplexity));

    const config = Arpeggiator.genRandomConfig({
      patternSize: settings.patternSize,
      numAttacks: numAttacks,
      maxSubdiv: settings.maxSubdiv,
    });

    let arpeggios: ChordEvent[] = chords;

    if (maxComplexity > 0) {
      arpeggios = Arpeggiator.arpeggiate(
        chords,
        config.numAttacks,
        config.maxSubdiv,
        config.patternSize,
        config.contourSize,
        recording.features.tempo!
      );
    }

    applyRmsToChordEvents(arpeggios, rms.data, rms.hopSize, sampleRate);

    // Update the features of the recording
    const features = {
      ...recording.features,
      noteEvents: detectedNotes.map((n) => ({ ...n, velocity: 0.707 })),
    };

    const tracks: TrackSequence = [
      {
        type: TrackType.AUDIO,
        data: {
          url: recording.url,
          onset: 0,
          duration: recording.duration,
        },
        config: {
          gain: 3,
        },
      },
      {
        type: TrackType.SYMBOLIC,
        data: {
          chordEvents: arpeggios,
          name: settings.instrumentName,
        },
      },
    ];

    const renderedBlob = await AudioRenderer.render(tracks);

    const recDuration = await getAudioDuration(renderedBlob);

    return {
      noteEvents: features.noteEvents,
      variation: {
        name: `${recording.name} (${settings.style} ${settings.instrumentName === InstrumentName.PIANO ? "🎹" : "🪕"})`,
        duration: recDuration,
        date: new Date().toLocaleString(),
        url: URL.createObjectURL(renderedBlob),
        tags: [...recording.tags, settings.style],
        features: {
          ...features,
          chordEvents: [
            // ...(!didDetectionFailed ? noteEventsToChordEvents(detectedNotes.map((note) => ({ ...note, velocity: 0.707 }))) : []),
            ...arpeggios,
          ],
        },
      },
    };
  } catch (error: unknown) {
    console.log(error);
  }
});

export default harmonize;
