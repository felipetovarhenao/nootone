import { createAsyncThunk } from "@reduxjs/toolkit";
import getAudioSpecs from "../../utils/getAudioSpecs";
import randomChoice from "../../utils/randomChoice";
import AudioRenderer from "../../utils/AudioRenderer";
import { InstrumentName, SymbolicMusicSequence } from "../../types/music";
import { TrackSequence, TrackType } from "../../types/audio";
import { generateArpeggio, generateBass, generatePads, getAudioFeatures, getChords, parseHarmonizerSettings } from "./harmonizeUtils";
import camelToSpaces from "../../utils/camelToSpaces";
import { HarmonizerPayload, HarmonizerReturnType } from "./harmonizeTypes";
import applyRmsToChordEvents from "../../utils/applyRmsToChordEvents";

async function harmonize(payload: HarmonizerPayload): Promise<void | HarmonizerReturnType> {
  // destructure payload
  const recording = payload.recording;
  const settings = parseHarmonizerSettings(recording, payload.settings);

  try {
    // get features
    const { noteEvents, rms, sampleRate } = await getAudioFeatures(recording);
    const chords = getChords(noteEvents, settings);

    const arpeggios = generateArpeggio(chords, recording.features.tempo, settings);
    applyRmsToChordEvents(arpeggios, rms.data, rms.hopSize, sampleRate);

    const bassLine = generateBass(chords, recording.features.tempo, settings);
    const pads = generatePads(chords, settings);

    const bassName = randomChoice<InstrumentName>([InstrumentName.ACOUSTIC_BASS, InstrumentName.ELECTRIC_BASS, InstrumentName.UPRIGHT_BASS])!;

    const tracks: TrackSequence = [
      {
        type: TrackType.AUDIO,
        data: {
          url: recording.url,
          duration: recording.duration,
        },
        config: {
          gain: 0.707,
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
      },
    ];

    const renderedBlob = await AudioRenderer.render(tracks);

    const variationName = `${recording.name} (${settings.style})`;

    const { duration: recDuration, sampleRate: varSampleRate } = await getAudioSpecs(renderedBlob);

    const symbolicTranscription: SymbolicMusicSequence = {
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
      features: { noteEvents: noteEvents, rms },
      variation: {
        name: variationName,
        duration: recDuration,
        sampleRate: varSampleRate,
        date: new Date().toLocaleString(),
        url: URL.createObjectURL(renderedBlob),
        tags: [...recording.tags, ...symbolicTranscription.instrumentalParts.map((x) => camelToSpaces(`${x.name}`)), settings.style],
        features: {
          ...recording.features,
          noteEvents: noteEvents.map((n) => ({ ...n, velocity: 0.707 })),
          symbolicTranscription,
        },
      },
    };
  } catch (error: unknown) {
    console.log(error);
  }
}

export default createAsyncThunk("recordings/harmonize", harmonize);
