import { Fraction } from "../../types/math";
import { ChordEvent, SymbolicMusicSequence } from "../../types/music";
import FractionOperator from "../FractionOperator";
import camelToSpaces from "../camelToSpaces";
import EnharmonicPitchSpeller from "./EnharmonicPitchSpeller";
import { KeySignature, SymbolicBeat, SymbolicEvent, SymbolicMeasure } from "./types";

export default class ScoreRenderer {
  private maxSubdivision: number;
  private musicSequence: SymbolicMusicSequence;
  private tempo: number;
  private beatDuration: number;
  private barDuration: number;
  private wholeNoteDuration: number;
  private timeSignature: Fraction;
  private keySignature: KeySignature;
  private beatUnit: Fraction;
  private numBeats: number;
  private numMeasures: number;

  constructor(musicSequence: SymbolicMusicSequence, maxSubdivision: number = 16) {
    this.maxSubdivision = maxSubdivision;
    this.musicSequence = musicSequence;
    this.timeSignature = musicSequence.timeSignature;
    this.keySignature = this.detectKeySignature();

    const { tempo, beatUnit } = this.getSymbolicTempoMarking();

    this.tempo = tempo;
    this.beatUnit = beatUnit;

    this.beatDuration = 60 / this.tempo;
    this.wholeNoteDuration = this.beatDuration * 4;
    this.barDuration = this.wholeNoteDuration * FractionOperator.fractionToDecimal(this.timeSignature);

    const sequenceDuration = this.getSequenceDuration(musicSequence);

    this.numBeats = Math.ceil(sequenceDuration / this.beatDuration);
    this.numMeasures = Math.ceil(sequenceDuration / this.barDuration);
  }

  private getSymbolicTempoMarking(): { tempo: number; beatUnit: Fraction } {
    const tempo = this.musicSequence.tempo;
    if (this.musicSequence.timeSignature.d === 4) {
      return { tempo, beatUnit: { n: 1, d: this.musicSequence.timeSignature.d } };
    }
    return { tempo: tempo * (3 / 2), beatUnit: { n: 3, d: this.musicSequence.timeSignature.d } };
  }

  private chordEventToSymbolicEvent(chordEvent: ChordEvent): SymbolicEvent {
    const timeDuration = chordEvent.notes[0].duration;
    const fractionalDuration = FractionOperator.decimalToFraction(timeDuration / this.wholeNoteDuration, [this.maxSubdivision]);
    const onset = FractionOperator.decimalToFraction(chordEvent.onset / this.wholeNoteDuration, [this.maxSubdivision]);

    let accent = false;
    const notes: number[] = [];
    chordEvent.notes.forEach((note) => {
      if (!accent && note.velocity > 0.5) {
        accent = true;
      }
      notes.push(note.pitch);
    });

    return {
      onset,
      duration: fractionalDuration,
      accent,
      notes,
    };
  }

  private getSequenceDuration(musicSequence: SymbolicMusicSequence) {
    let duration = 0;
    musicSequence.instrumentalParts.forEach((p) =>
      p.chordEvents.forEach((c) => c.notes.forEach((n) => (duration = Math.max(duration, n.duration + c.onset))))
    );
    return duration;
  }

  private checkBeatDuration(beat: SymbolicBeat) {
    let duration = { n: 0, d: 1 };
    beat.events.forEach((e) => (duration = FractionOperator.add(duration, e.duration)));
    return FractionOperator.equal(duration, beat.duration);
  }

  private symbolicEventsToBeats(symbolicEvents: SymbolicEvent[]): SymbolicBeat[] {
    const decimalBeatUnit = this.beatUnit.n / this.beatUnit.d;

    symbolicEvents.sort((a, b) => FractionOperator.fractionToDecimal(FractionOperator.subtract(a.onset, b.onset)));

    const symBeats: SymbolicBeat[] = [...Array(this.numBeats).keys()].map((i) => ({
      onset: FractionOperator.reduce(FractionOperator.multiply(this.beatUnit, { n: i, d: 1 })),
      duration: this.beatUnit,
      events: [],
    }));

    /* group events into beats */
    for (let i = 0; i < symbolicEvents.length; i++) {
      const symEvent = symbolicEvents[i];

      // get beat index
      const decimalOnset = FractionOperator.fractionToDecimal(symEvent.onset);
      const beatIndex = Math.floor(decimalOnset / decimalBeatUnit + 1e-8);

      const nextBeatOnset = FractionOperator.add(symBeats[beatIndex].onset, symBeats[beatIndex].duration);
      const nextOnset = i < symbolicEvents.length - 1 ? FractionOperator.min(nextBeatOnset, symbolicEvents[i + 1].onset) : nextBeatOnset;
      const maxDuration = FractionOperator.reduce(FractionOperator.subtract(nextOnset, symEvent.onset));
      if (maxDuration.n === 0) {
        continue;
      }
      symBeats[beatIndex].events.push({ ...symEvent, duration: maxDuration });
    }

    /* add rests to beats */
    for (let i = 0; i < symBeats.length; i++) {
      const beat = symBeats[i];

      /* if empty, fill beat with rest */
      if (beat.events.length === 0) {
        beat.events.push({
          onset: beat.onset,
          duration: beat.duration,
          notes: [],
        });
        continue;
      }

      const rests: SymbolicEvent[] = [];

      /* check if beat requires initial rest */
      const initialGap = FractionOperator.reduce(FractionOperator.subtract(beat.events[0].onset, beat.onset));

      if (FractionOperator.fractionToDecimal(initialGap) > 0) {
        rests.push({
          onset: beat.onset,
          duration: initialGap,
          notes: [],
        });
      }

      const beatEnd = FractionOperator.reduce(FractionOperator.add(beat.onset, beat.duration));

      /* add rests to fill event gaps */
      for (let j = 0; j < beat.events.length; j++) {
        const event = beat.events[j];
        const eventEnd = FractionOperator.reduce(FractionOperator.add(event.onset, event.duration));
        const nextOnset = j < beat.events.length - 1 ? beat.events[j + 1].onset : beatEnd;
        const gapDuration = FractionOperator.reduce(FractionOperator.subtract(nextOnset, eventEnd));

        if (FractionOperator.fractionToDecimal(gapDuration) > 0) {
          rests.push({
            onset: eventEnd,
            duration: gapDuration,
            notes: [],
          });
        }
      }

      rests.forEach((r) => beat.events.push(r));
      beat.events.sort((a, b) => FractionOperator.fractionToDecimal(FractionOperator.subtract(a.onset, b.onset)));

      if (!this.checkBeatDuration(beat)) {
        console.log("beat duration error: ", beat);
      }
    }

    return symBeats;
  }

  private symbolicBeatsToMeasures(beats: SymbolicBeat[]): SymbolicMeasure[] {
    const symMeasures: SymbolicMeasure[] = [...Array(this.numMeasures).keys()].map((i) => ({
      onset: FractionOperator.reduce(FractionOperator.multiply(this.timeSignature, { n: i, d: 1 })),
      duration: this.timeSignature,
      beats: [],
    }));

    const decimalMeasureDuration = FractionOperator.fractionToDecimal(this.timeSignature);

    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i];
      const decimalOnset = FractionOperator.fractionToDecimal(beat.onset);
      const measureIndex = Math.floor(decimalOnset / decimalMeasureDuration + 1e-6);
      symMeasures[measureIndex]?.beats.push(beat);
    }
    symMeasures.forEach((m, i) => {
      if (!this.checkMeasureDuration(m) && i < this.numMeasures - 1) {
        console.log(`measure duration error (${i + 1} of ${this.numMeasures}): `, m);
      }
    });
    return symMeasures;
  }

  private checkMeasureDuration(measure: SymbolicMeasure) {
    let duration = { n: 0, d: 1 };
    measure.beats.forEach((beat) => beat.events.forEach((e) => (duration = FractionOperator.add(duration, e.duration))));
    return FractionOperator.equal(measure.duration, duration);
  }

  private preprocessChordEvents(chordEvents: ChordEvent[]): SymbolicMeasure[] {
    const symEvents = chordEvents.map((chordEvent) => this.chordEventToSymbolicEvent(chordEvent));
    const symBeats = this.symbolicEventsToBeats(symEvents);
    const symMeasures = this.symbolicBeatsToMeasures(symBeats);
    return symMeasures;
  }

  private parseMusicSequence(musicSequence: SymbolicMusicSequence) {
    let score = "";
    for (let i = 0; i < musicSequence.instrumentalParts.length; i++) {
      /* get instrumental part */
      const instrumentalPart = musicSequence.instrumentalParts[i];

      const chordEvents = instrumentalPart.chordEvents;

      // get chord events
      const measures = this.preprocessChordEvents(chordEvents);

      const clef = this.getClef(chordEvents);

      const voiceName = camelToSpaces(instrumentalPart.name);

      let voice = `V: ${i + 1} clef=${clef} name=\"${voiceName}\" snm=\"${voiceName[0]}.\"\n`;

      measures.forEach((m, i) => {
        const breakSystem = i === measures.length - 1;
        voice += this.parseMeasure(m, breakSystem);
      });

      score += `${voice}|\n`;
    }

    return score;
  }
  private getClef(chordEvents: ChordEvent[]): string {
    let pitchSum = 0;
    let numPitches = 0;

    chordEvents.forEach((chord) =>
      chord.notes.forEach((note) => {
        pitchSum += note.pitch;
        numPitches++;
      })
    );
    const meanOctave = Math.round(pitchSum / numPitches / 12);
    if (meanOctave <= 4) {
      return "bass";
    } else {
      return "treble";
    }
  }

  private parseMeasure(measure: SymbolicMeasure, breakSystem: boolean = true): string {
    let abc = " |";
    measure.beats.forEach((beat) => {
      abc += this.parseBeat(beat);
    });
    if (breakSystem) {
      abc += "|";
    }
    return abc;
  }

  private parseBeat(beat: SymbolicBeat): string {
    let abc = "";
    beat.events.forEach((event) => (abc += this.parseEvent(event)));
    abc += " ";
    return abc;
  }

  private parseEvent(event: SymbolicEvent): string {
    let abc = "";
    const duration = `${event.duration.n}/${event.duration.d}`;
    if (event.notes.length === 0) {
      abc += `z`;
    } else {
      abc += "[";
      if (event.accent) {
        abc += "L";
      }
      event.notes.forEach((p) => {
        abc += this.pitchToABC(p);
      });
      abc += "]";
    }
    abc += duration;
    return abc;
  }

  public render(options?: ScoreRendererOptions): string {
    const { author = "" } = options || {};
    let score = "";
    const header = this.createScoreHeader(author);
    const body = this.parseMusicSequence(this.musicSequence);

    score += header;
    score += body;

    return score;
  }

  private pitchToABC(pitch: number) {
    const octaveOffset = Math.floor((pitch - 60) / 12);
    const enharmonicPitch = EnharmonicPitchSpeller.getEnharmonicPitch(pitch % 12, this.keySignature);
    let pitchName = `${enharmonicPitch.accidental || ""}${enharmonicPitch.name}`;
    for (let i = 0; i < Math.abs(octaveOffset); i++) {
      pitchName += octaveOffset > 0 ? "'" : ",";
    }

    return pitchName;
  }

  private createScoreHeader(author: string) {
    const keySig = EnharmonicPitchSpeller.keySignatureToString(this.keySignature);

    let header = {
      X: 1,
      T: `${this.musicSequence.title}`,
      M: `${this.timeSignature.n}/${this.timeSignature.d}`,
      L: "1/1",
      C: author,
      directives: {
        stretchlast: "",
        stretchstaff: "",
      },
      Q: `${this.beatUnit.n}/${this.beatUnit.d}=${Math.round(this.musicSequence.tempo)}`,
      K: keySig,
      S: "https://nootone.io",
    };

    let headerString = "";
    Object.entries(header).forEach((entry) => {
      const [key, value] = entry;
      if (key === "directives") {
        const directive = header[key] as any;
        Object.keys(directive).forEach((dirKey: string) => {
          headerString += `%%${dirKey} ${directive[dirKey]}\n`;
        });
        return;
      }
      headerString += `${key}: ${value}\n`;
    });

    return headerString;
  }

  private detectKeySignature(): KeySignature {
    const chroma = [...Array(12)].fill(0);
    this.musicSequence.instrumentalParts.forEach((instrumentalPart) =>
      instrumentalPart.chordEvents.forEach((chordEvent) => chordEvent.notes.forEach((note) => chroma[note.pitch % 12]++))
    );
    const maxBin = Math.max(...chroma);
    const root = chroma.indexOf(maxBin);
    const isMajor = chroma[(root + 4) % 12] >= chroma[(root + 3) % 12];
    return EnharmonicPitchSpeller.getKeySignature(root, isMajor);
  }
}

type ScoreRendererOptions = {
  author?: string;
  measuresPerSystem?: number;
};
