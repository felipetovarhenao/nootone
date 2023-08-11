import { Recording } from "../../types/audio";
import { ChordEvent } from "../../types/music";
import Arpeggiator from "../../utils/Arpeggiator";
import NoteHarmonizer from "../../utils/NoteHarmonizer";
import PitchDetector from "../../utils/PitchDetector";
import applyLegatoToChordEvents from "../../utils/applyLegatoToChordEvents";
import applyVoiceLeading from "../../utils/applyVoiceLeading";
import audioArrayFromURL from "../../utils/audioArrayFromURL";
import findNearestValue from "../../utils/findNearestValue";
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

export async function getAudioFeatures(recording: Recording): Promise<ChordEvent[]> {
  // Detect the pitches of the recorded notes or use the pre-computed note events
  let chordEvents = recording.features.chordEvents;

  if (!chordEvents) {
    const { array, sampleRate } = await audioArrayFromURL(recording.url);
    const detector = new PitchDetector();
    chordEvents = detector.getChordEvents(array, sampleRate, recording.features.tempo, 4);
  }

  if (chordEvents.length === 0) {
    chordEvents = noteEventsToChordEvents(generateRandomNoteEvents(recording.duration, recording.features.tempo!));
  }

  return chordEvents;
}

export function getChords(chordEvents: ChordEvent[], settings: ParsedHarmonizerSettings): ChordEvent[] {
  const chordPredictions = new NoteHarmonizer().harmonize(chordEvents, settings.style, settings.segSize);

  // Generate the individual note events from the harmonic blocks and apply voice leading
  const chordProgression = applyVoiceLeading(chordPredictions.map((chord) => chord.notes.map((note) => note.pitch)));

  const chords = chordProgression.map((chord, i) => ({
    onset: chordPredictions[i].onset,
    notes: chord.sort().map((pitch) => ({
      pitch,
      duration: settings.segSize,
      velocity: 1,
    })),
  }));

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

export function transferVelocity(sourceEvents: ChordEvent[], targetEvent: ChordEvent[]): void {
  const sourceOnsets = sourceEvents.map((x) => x.onset);
  targetEvent.forEach((e) => {
    const index = findNearestValue(sourceOnsets, e.onset)[1];
    const notes = sourceEvents[index].notes;
    const sourceVelocity = notes.map((x) => x.velocity).reduce((x, sum) => x + sum, 0) / notes.length;
    e.notes.forEach((note) => {
      note.velocity = note.velocity * sourceVelocity;
    });
  });
}
