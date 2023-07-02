import { ChordEvent } from "../types/music";
import getRandomNumber from "./getRandomNumber";
import randomChoice from "./randomChoice";

type ArpeggioPattern = {
  onset: number;
  notes: { index: number; velocity: number; duration: number }[];
}[];

export default class Arpeggiator {
  /**
   * Create a random contour array.
   * @param N - The number of elements in the contour array.
   * @returns An array of random values representing the contour.
   */
  private static createRandomContour(N: number = 4): number[] {
    // Random values between 0 and 1
    if (Math.random() > 0.5) {
      const x: number[] = [];
      for (let i = 0; i < N; i++) {
        x.push(Math.random());
      }
      if (N === 1) {
        return x;
      }
      // Normalize values between 0 and 1
      const xMin = Math.min(...x);
      return x.map((value) => (value - xMin) / (Math.max(...x) - xMin));
    } else {
      // Generate values evenly spaced between 0 and 1
      const x = Array.from({ length: N }, (_, index) => index / Math.max(1, N - 1));

      // Shuffle the values randomly
      for (let i = x.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [x[i], x[j]] = [x[j], x[i]];
      }
      return x;
    }
  }

  /**
   * Generate an array of sorted unique numbers within a range.
   * @param count - The number of unique numbers to generate.
   * @param rangeSize - The size of the range.
   * @param offset - The offset of the range.
   * @returns An array of sorted unique numbers.
   * @throws Error if the range is not large enough to generate unique numbers.
   */
  private static generateSortedUniqueNumbers(count: number, rangeSize: number, offset: number = 0): number[] {
    const end = offset + rangeSize;
    if (rangeSize < count) {
      throw new Error("The range is not large enough to generate unique numbers.");
    }

    // Generate numbers within the range
    const numbers: number[] = [];
    for (let i = offset; i < end; i++) {
      numbers.push(i);
    }

    // Shuffle the numbers randomly
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);

    // Select the first 'count' numbers and sort them in ascending order
    const selectedNumbers = shuffledNumbers.slice(0, count);
    selectedNumbers.sort((a, b) => a - b);

    // Subtract the minimum value from all the numbers
    for (let i = 0; i < count; i++) {
      selectedNumbers[i] -= selectedNumbers[0];
    }
    return selectedNumbers;
  }

  /**
   * Create a random grid of onset positions within a pattern duration.
   * @param patternDuration - The duration of the pattern.
   * @param quantumUnit - The duration of each grid unit.
   * @param patternSize - The size of the pattern.
   * @returns An array of random onset positions.
   */
  private static createRandomGrid(patternDuration: number, quantumUnit: number, patternSize: number): number[] {
    const maxAttacks = Math.floor(patternDuration / quantumUnit);
    const attacks = Math.min(patternSize, maxAttacks);

    // Generate sorted unique numbers within the range of maximum attacks
    const grid = Arpeggiator.generateSortedUniqueNumbers(attacks, maxAttacks).map((value) => (value / maxAttacks) * patternDuration);
    return grid;
  }

  /**
   * Convert an index pattern to time points.
   * @param indexPattern - The index pattern.
   * @param duration - The duration of the pattern.
   * @returns An array of time points represented as tuples of onset and index.
   */
  private static indexPatternToTimePoints(indexPattern: number[], duration: number): { onset: number; index: number }[] {
    const patternSize = indexPattern.length;

    // Calculate marker positions evenly spaced in the duration
    const markers = Array.from({ length: patternSize + 1 }, (_, i) => (i / patternSize) * duration);

    // Convert markers to time points with their corresponding indices
    const timePoints = markers.slice(0, -1).map((marker, index) => ({ onset: marker, index: indexPattern[index] }));
    return timePoints;
  }

  /**
   * Group indices based on their closest onset positions.
   * @param A - An array of time points represented as tuples of onset and index.
   * @param B - An array of onset positions.
   * @returns An array of grouped indices with their corresponding onset positions.
   */
  private static groupIndices(A: { onset: number; index: number }[], B: number[], patternDuration: number, quantumUnit: number): ArpeggioPattern {
    const result: { onset: number; notes: { index: number; velocity: number; duration: number }[] }[] = [];

    const maxAttacks = Math.floor(patternDuration / quantumUnit);
    function getNoteEnd(index: number) {
      let stopIndex = maxAttacks;
      if (index < maxAttacks - 1) {
        stopIndex = getRandomNumber(index + 1, maxAttacks);
      }
      return stopIndex * quantumUnit;
    }

    let noteEnd = getNoteEnd(0);
    for (let i = 0; i < A.length; i++) {
      const { onset, index } = A[i];
      let minDiff = Infinity;
      let closestOnset: number | null = null;

      // Find the closest onset position from B
      for (let j = 0; j < B.length; j++) {
        const bOnset = B[j];
        const diff = Math.abs(onset - bOnset);
        if (diff < minDiff) {
          minDiff = diff;
          closestOnset = bOnset;
        }
      }

      if (closestOnset !== null) {
        let found = false;

        if (noteEnd <= closestOnset) {
          noteEnd = getNoteEnd(Math.floor(closestOnset / quantumUnit));
        }
        const eventDuration = noteEnd - closestOnset;

        // Check if the onset position already exists in the result
        for (const item of result) {
          if (item.onset === closestOnset) {
            item.notes.push({ index: index, velocity: Math.random(), duration: eventDuration });
            found = true;
            break;
          }
        }
        // If not found, add a new entry to the result
        if (!found) {
          result.push({ onset: closestOnset, notes: [{ index: index, velocity: Math.random(), duration: eventDuration }] });
        }
      }
    }
    return result;
  }

  /**
   * Generate a random configuration object.
   * @returns A configuration object with random values.
   */
  public static genRandomConfig(defaultValues?: { patternSize?: number; maxSubdiv?: number; numAttacks?: number; contourSize?: number }): {
    patternSize: number;
    maxSubdiv: number;
    numAttacks: number;
    contourSize: number;
  } {
    const patternSize = defaultValues?.patternSize || [2, 4][Math.floor(Math.random() * 2)];
    const maxSubdiv = defaultValues?.maxSubdiv || [3, 4][Math.floor(Math.random() * 2)];
    const numAttacks = defaultValues?.numAttacks || Math.floor(Math.random() * (patternSize * maxSubdiv - 1) + 1);
    const contourSize = defaultValues?.contourSize || Math.max(6, Math.floor(Math.random() * numAttacks + numAttacks));

    return {
      patternSize,
      maxSubdiv,
      numAttacks,
      contourSize,
    };
  }

  public static generateArpeggioPattern(numAttacks: number, quantumUnit: number, patternDuration: number, contourSize: number) {
    // Get normalized index contour
    const normalizedContour = this.createRandomContour(contourSize);

    // Generate a random onset grid
    const onsetGrid = this.createRandomGrid(patternDuration, quantumUnit, numAttacks);

    // Assign onset positions to contour
    const rawIndexPattern = this.indexPatternToTimePoints(normalizedContour, patternDuration);
    const arpeggioPattern = this.groupIndices(rawIndexPattern, onsetGrid, patternDuration, quantumUnit);
    return arpeggioPattern;
  }

  /**
   * Generate an arpeggio sequence based on the provided chords and configuration.
   * @param chords - The input chords.
   * @param numAttacks - The number of attacks.
   * @param maxSubdiv - The maximum subdivision.
   * @param patternSize - The pattern size.
   * @param contourSize - The contour size.
   * @param tempo - The tempo in beats per minute.
   * @returns The generated arpeggio sequence as an array of ChordEvent objects.
   */
  public static arpeggiate(
    chords: ChordEvent[],
    numAttacks: number = 6,
    maxSubdiv: number = 4,
    patternSize: number = 2,
    contourSize: number = 8,
    tempo: number = 60
  ): ChordEvent[] {
    // Get beat duration
    const beatDuration = 60 / tempo;

    // Get pattern duration
    const patternDuration = beatDuration * patternSize;

    // Get grid quantization duration unit
    const quantumUnit = beatDuration / maxSubdiv;

    // generate arpeggio pattern
    const arpeggioPattern = this.generateArpeggioPattern(numAttacks, quantumUnit, patternDuration, contourSize);

    const sortedChords = chords.sort((a, b) => a.onset - b.onset);

    const timeOffset = sortedChords[0].onset;
    const totalDur = sortedChords[sortedChords.length - 1].onset - timeOffset + sortedChords[sortedChords.length - 1].notes[0].duration;

    const numPatterns = Math.round(totalDur / patternDuration);
    const arpeggioSequence: ChordEvent[] = [];

    let nextChordOnset: number | null = null;
    let currentChord: ChordEvent | null = null;
    let currentChordIndex = 0;
    let lastChordReached = false;
    const numChords = sortedChords.length;

    const groovy = Math.random() > 0.5;

    for (let i = 0; i < numPatterns; i++) {
      const patternOffset = patternDuration * i + timeOffset;
      const variation = i > 0 ? this.getArpeggioPatternVariation(arpeggioPattern, quantumUnit, patternDuration) : arpeggioPattern;
      for (let e = 0; e < variation.length; e++) {
        const event = variation[e];
        const onset = event.onset + patternOffset;
        if (currentChord === null || (onset >= nextChordOnset! && !lastChordReached)) {
          // Find the next chord event
          for (let j = currentChordIndex + 1; j < numChords; j++) {
            if (onset >= sortedChords[j].onset) {
              currentChordIndex = j;
              break;
            }
          }
          currentChord = sortedChords[currentChordIndex];
          if (currentChordIndex < numChords - 1) {
            nextChordOnset = sortedChords[currentChordIndex + 1].onset;
            currentChordIndex++;
          } else {
            lastChordReached = true;
          }
        }

        const arpChordEvent: ChordEvent = {
          onset: onset,
          notes: event.notes.map((e) => {
            const noteIndex = Math.floor(e.index * (currentChord!.notes.length - 1));
            const note = { ...currentChord!.notes[noteIndex] };
            note.duration = note.duration - (event.onset % note.duration);
            if (groovy) {
              note.duration = Math.min(e.duration, note.duration);
            }
            note.velocity = e.velocity;
            return note;
          }),
        };

        arpeggioSequence.push(arpChordEvent);
      }
    }
    const lastChord = { ...sortedChords.at(-1)! };
    lastChord.onset = numPatterns * patternDuration;
    lastChord.notes.forEach((n) => {
      n.velocity = Math.random() * 0.5 + 0.5;
    });
    arpeggioSequence.push(lastChord);

    return arpeggioSequence;
  }

  private static getArpeggioPatternVariation(arpegioPattern: ArpeggioPattern, quantumUnit: number, patternDuration: number) {
    const arpeggioCopy = JSON.parse(JSON.stringify(arpegioPattern)) as ArpeggioPattern;
    const actions = ["prune", "add", "shuffle", "nothing"];

    function getOnsets(arp: ArpeggioPattern) {
      const maxAttacks = patternDuration / quantumUnit;
      const emptyOnsets = [];
      const activeOnsets = arp.map((x) => x.onset);
      for (let i = 0; i < maxAttacks; i++) {
        const onset = i * quantumUnit;
        if (!activeOnsets.includes(onset)) {
          emptyOnsets.push(onset);
        }
      }
      return { emptyOnsets, activeOnsets };
    }

    function prune(arp: ArpeggioPattern) {
      if (arp.length === 1) {
        return;
      }
      const index = getRandomNumber(1, arp.length);
      return arp.splice(index, 1);
    }

    function add(arp: ArpeggioPattern) {
      const { emptyOnsets } = getOnsets(arp);
      if (emptyOnsets.length === 0) {
        return;
      }
      const newOnset = randomChoice(emptyOnsets) as number;
      arp.push({ onset: newOnset, notes: [{ index: Math.random(), velocity: Math.random(), duration: quantumUnit }] });
    }

    function shuffle(arp: ArpeggioPattern) {
      if (arp.length === 1) {
        return;
      }
      const { emptyOnsets } = getOnsets(arp);
      if (emptyOnsets.length === 0) {
        return;
      }
      const oldEventIndex = getRandomNumber(1, arp.length);
      const newOnset = randomChoice(emptyOnsets) as number;
      const oldEvent = arp[oldEventIndex];
      const newEvent = { ...oldEvent, onset: newOnset };
      arp.splice(oldEventIndex, 1);
      arp.push(newEvent);
    }
    const numChanges = getRandomNumber(1, 2);
    for (let i = 0; i < numChanges; i++) {
      const action = randomChoice(actions) as string;
      switch (action) {
        case "prune":
          prune(arpeggioCopy);
          break;
        case "add":
          add(arpeggioCopy);
          break;
        case "shuffle":
          shuffle(arpeggioCopy);
          break;
        default:
          break;
      }
    }
    arpeggioCopy.sort((a, b) => a.onset - b.onset);
    return arpeggioCopy;
  }
}
