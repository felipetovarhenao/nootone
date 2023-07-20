import { Recording } from "../../types/audio";
import { ChordEvent, NoteEvent } from "../../types/music";
import Arpeggiator from "../../utils/Arpeggiator";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import applyLegatoToChordEvents from "../../utils/applyLegatoToChordEvents";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import extractAudioFeatures from "../../utils/extractAudioFeatures";
import generateBassLine from "../../utils/generateBassLine";
import generateRandomNoteEvents from "../../utils/generateRandomNoteEvents";
import noteEventsToChordEvents from "../../utils/noteEventsToChordEvents";
import randomChoice from "../../utils/randomChoice";
import { HarmonizerSettings, ParsedHarmonizerSettings } from "./harmonizeTypes";

export function parseHarmonizerSettings(recording: Recording, settings: HarmonizerSettings): ParsedHarmonizerSettings {
  const maxAttacks = settings.patternSize * settings.maxSubdiv;

  const { min: minComplexity, max: maxComplexity } = settings.rhythmicComplexity;
  const numAttacks = Math.ceil(maxAttacks * (Math.random() * (maxComplexity - minComplexity) + minComplexity));

  const patternSize = settings.patternSize;
  const maxSubdiv = settings.maxSubdiv;

  const contourSize = Math.max(6, Math.floor(Math.random() * numAttacks * 2 + numAttacks));
  const segSize = (60 / recording.features.tempo || 60) * randomChoice(settings.segSizes)!;

  return {
    ...settings,
    patternSize,
    maxSubdiv,
    maxAttacks,
    numAttacks,
    segSize,
    contourSize,
    grooviness: Math.random() * (settings.groovinessRange.max - settings.groovinessRange.min) + settings.groovinessRange.min,
  };
}

export async function getAudioFeatures(recording: Recording) {
  // Detect the pitches of the recorded notes or use the pre-computed note events
  let noteEvents = recording.features.noteEvents;
  let rms = recording.features.rms;
  let sampleRate = recording.sampleRate;
  if (!noteEvents || !rms) {
    const { array, sampleRate: sr } = await audioArrayFromURL(recording.url);
    const { noteEvents: detectedNotes, rms: rmsArray, hopSize } = extractAudioFeatures(array, sampleRate);
    noteEvents = detectedNotes.map((n) => ({ ...n, velocity: 1 }));
    rms = { hopSize: hopSize, data: Array.from(rmsArray) };
    sampleRate = sr;
  }

  // let didDetectionFailed = false;
  if (noteEvents.length === 0) {
    // didDetectionFailed = true;
    noteEvents = generateRandomNoteEvents(recording.duration, recording.features.tempo!);
  }

  return {
    noteEvents,
    rms,
    sampleRate,
  };
}

export function getChords(noteEvents: NoteEvent[], settings: ParsedHarmonizerSettings): ChordEvent[] {
  const chordPredictions = new NoteHarmonizer().harmonize(
    noteEvents.map((n) => ({ ...n, velocity: 1 })),
    settings.style,
    settings.segSize
  );

  // Generate the individual note events from the harmonic blocks and apply voice leading
  const notes: NoteEvent[] = [];
  const chordProgression = applyVoiceLeading(chordPredictions.map((chord) => chord.notes.map((note) => note.pitch)));

  chordProgression.forEach((chord: number[], i) =>
    chord.sort().forEach((pitch: number) => notes.push({ pitch: pitch, onset: chordPredictions[i].onset, duration: settings.segSize, velocity: 1 }))
  );

  // Convert the note events into chord events and arpeggiate the chords
  const chords = noteEventsToChordEvents(notes);

  return chords;
}

export function generateArpeggio(chords: ChordEvent[], tempo: number, settings: ParsedHarmonizerSettings) {
  let arpeggios: ChordEvent[] = chords;

  if (settings.rhythmicComplexity.max > 0) {
    arpeggios = Arpeggiator.arpeggiate(
      chords,
      settings.numAttacks,
      settings.maxSubdiv,
      settings.patternSize,
      settings.contourSize,
      tempo,
      settings.grooviness
    );
  }

  return arpeggios;
}

export function generateBass(chords: ChordEvent[], tempo: number, settings: ParsedHarmonizerSettings) {
  const bassLine =
    settings.rhythmicComplexity.max > 0
      ? generateBassLine(chords, settings.numAttacks, settings.maxSubdiv, settings.patternSize, settings.contourSize, tempo, settings.grooviness)
      : chords.map((chord) => {
          const bass = { ...chord, notes: chord.notes.slice(0, 1) };
          bass.notes.forEach((note) => (note.pitch -= 12));
          return bass;
        });

  applyLegatoToChordEvents(bassLine);
  return bassLine;
}

export function generatePads(chords: ChordEvent[], settings: ParsedHarmonizerSettings) {
  const pads = chords.map((chord) => ({
    ...chord,
    notes: chord.notes.map((note) => ({
      ...note,
      duration: note.duration * 2 ** Math.round(Math.log2(1 - settings.grooviness)),
      velocity: Math.random() * 0.4 + 0.1,
    })),
  }));
  return pads;
}
