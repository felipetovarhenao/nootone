import { createAsyncThunk } from "@reduxjs/toolkit";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import noteEventsToChordEvents from "../../utils/noteEventsToChordEvents";
import getAudioDuration from "../../utils/getAudioDuration";
import { ChordEvent, InstrumentName, NoteEvent, SymbolicMusicSequence } from "../../types/music";
import { Recording, TrackSequence, TrackType } from "../../types/audio";
import extractAudioFeatures from "../../utils/extractAudioFeatures";
import Arpeggiator from "../../utils/Arpeggiator";
import generateRandomNoteEvents from "../../utils/generateRandomNoteEvents";
import randomChoice from "../../utils/randomChoice";
import AudioRenderer from "../../utils/AudioRenderer";
import applyRmsToChordEvents from "../../utils/applyRmsToChordEvents";
import generateBassLine from "./generateBassLine";
import applyLegatoToChordEvents from "../../utils/applyLegatoToChordEvents";
import { Fraction } from "../../types/math";

export type HarmonizerSettings = {
  style: string;
  patternSize: number;
  segSizes: number[];
  rhythmicComplexity: { min: number; max: number };
  maxSubdiv: number;
  instrumentName: InstrumentName;
  timeSignature: Fraction;
  groovinessRange: { min: number; max: number };
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

    const grooviness = Math.random() * (settings.groovinessRange.max - settings.groovinessRange.min) + settings.groovinessRange.min;

    if (maxComplexity > 0) {
      arpeggios = Arpeggiator.arpeggiate(
        chords,
        config.numAttacks,
        config.maxSubdiv,
        config.patternSize,
        config.contourSize,
        recording.features.tempo!,
        grooviness
      );
    }

    applyRmsToChordEvents(arpeggios, rms.data, rms.hopSize, sampleRate);

    // Update the features of the recording
    const features = {
      ...recording.features,
      noteEvents: detectedNotes.map((n) => ({ ...n, velocity: 0.707 })),
    };

    const bassLine =
      maxComplexity > 0
        ? generateBassLine(chords, config.numAttacks, config.maxSubdiv, config.patternSize, config.contourSize, recording.features.tempo!, grooviness)
        : chords.map((chord) => {
            const bass = { ...chord, notes: chord.notes.slice(0, 1) };
            bass.notes.forEach((note) => (note.pitch -= 12));
            return bass;
          });
    // applyRmsToChordEvents(bassLine, rms.data, rms.hopSize, sampleRate);

    applyLegatoToChordEvents(bassLine);

    const bassName = randomChoice<InstrumentName>([InstrumentName.ACOUSTIC_BASS, InstrumentName.ELECTRIC_BASS, InstrumentName.UPRIGHT_BASS])!;

    const pads = chords.map((chord) => ({
      ...chord,
      notes: chord.notes.map((note) => ({
        ...note,
        duration: note.duration * 2 ** Math.round(Math.log2(1 - grooviness)),
        velocity: Math.random() * 0.4 + 0.1,
      })),
    }));
    const tracks: TrackSequence = [
      {
        type: TrackType.AUDIO,
        data: {
          url: recording.url,
          onset: 0,
          duration: recording.duration,
        },
        config: {
          gain: 1.25,
        },
      },
      {
        type: TrackType.SYMBOLIC,
        data: {
          chordEvents: arpeggios,
          name: settings.instrumentName,
        },
      },
      {
        type: TrackType.SYMBOLIC,
        data: {
          chordEvents: pads,
          name: InstrumentName.PAD,
        },
      },
      {
        type: TrackType.SYMBOLIC,
        data: {
          chordEvents: bassLine,
          name: bassName,
        },
        config: {
          gain: 0.707,
        },
      },
    ];

    const renderedBlob = await AudioRenderer.render(tracks);

    const variationName = `${recording.name} (${settings.style} ${settings.instrumentName === InstrumentName.PIANO ? "🎹" : "🪕"})`;

    const recDuration = await getAudioDuration(renderedBlob);

    const symbolicRepresentation: SymbolicMusicSequence = {
      title: variationName,
      tempo: recording.features.tempo,
      timeSignature: settings.timeSignature,
      instrumentalParts: [
        { name: settings.instrumentName, chordEvents: arpeggios },
        { name: InstrumentName.PAD, chordEvents: pads },
        { name: bassName, chordEvents: bassLine },
      ],
    };

    return {
      noteEvents: features.noteEvents,
      variation: {
        name: variationName,
        duration: recDuration,
        date: new Date().toLocaleString(),
        url: URL.createObjectURL(renderedBlob),
        tags: [...recording.tags, settings.style],
        features: {
          ...features,
          symbolicRepresentation: symbolicRepresentation,
        },
      },
    };
  } catch (error: unknown) {
    console.log(error);
  }
});

export default harmonize;
