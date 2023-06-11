import { ChordEvent } from "../types/music";

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
      const x = Array.from({ length: N }, (_, index) => index / (N - 1));

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
  private static indexPatternToTimePoints(indexPattern: number[], duration: number): [number, number][] {
    const patternSize = indexPattern.length;

    // Calculate marker positions evenly spaced in the duration
    const markers = Array.from({ length: patternSize + 1 }, (_, i) => (i / patternSize) * duration);

    // Convert markers to time points with their corresponding indices
    const timePoints: [number, number][] = markers.slice(0, -1).map((marker, index) => [marker, indexPattern[index]]);
    return timePoints;
  }

  /**
   * Group indices based on their closest onset positions.
   * @param A - An array of time points represented as tuples of onset and index.
   * @param B - An array of onset positions.
   * @returns An array of grouped indices with their corresponding onset positions.
   */
  private static groupIndices(A: [number, number][], B: number[]): { onset: number; indices: number[] }[] {
    const result: { onset: number; indices: number[] }[] = [];
    for (const [onset, index] of A) {
      let minDiff = Infinity;
      let closestOnset: number | null = null;

      // Find the closest onset position from B
      for (const bOnset of B) {
        const diff = Math.abs(onset - bOnset);
        if (diff < minDiff) {
          minDiff = diff;
          closestOnset = bOnset;
        }
      }

      if (closestOnset !== null) {
        let found = false;
        // Check if the onset position already exists in the result
        for (const item of result) {
          if (item.onset === closestOnset) {
            item.indices.push(index);
            found = true;
            break;
          }
        }
        // If not found, add a new entry to the result
        if (!found) {
          result.push({ onset: closestOnset, indices: [index] });
        }
      }
    }
    return result;
  }

  /**
   * Generate a random configuration object.
   * @returns A configuration object with random values.
   */
  public static genRandomConfig(): {
    patternSize: number;
    maxSubdiv: number;
    numAttacks: number;
    contourSize: number;
  } {
    const patternSize = [2, 4][Math.floor(Math.random() * 2)];
    const maxSubdiv = [3, 4][Math.floor(Math.random() * 2)];
    const numAttacks = Math.floor(Math.random() * (patternSize * maxSubdiv - 1) + 1);
    const contourSize = Math.max(5, Math.floor(Math.random() * numAttacks + numAttacks));

    return {
      patternSize,
      maxSubdiv,
      numAttacks,
      contourSize,
    };
  }

  /**
   * Generates a random velocity pattern for an arpeggio sequence.
   *
   * @param arpeggioPattern - The arpeggio pattern containing onset positions and indices.
   * @returns A 2D array of random velocities corresponding to the arpeggio pattern.
   */
  private static getRandomVelocityPattern(arpeggioPattern: { onset: number; indices: number[] }[]): number[][] {
    const randomVelocities: number[][] = [];
    arpeggioPattern.forEach((e) => {
      const vels: number[] = [];
      e.indices.forEach((_) => vels.push(Math.random() * 0.5 + 0.5));
      randomVelocities.push(vels);
    });
    return randomVelocities;
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

    // Get normalized index contour
    const normalizedContour = this.createRandomContour(contourSize);

    // Generate a random onset grid
    const onsetGrid = this.createRandomGrid(patternDuration, quantumUnit, numAttacks);

    // Assign onset positions to contour
    const rawIndexPattern = this.indexPatternToTimePoints(normalizedContour, patternDuration);
    const arpeggioPattern = this.groupIndices(rawIndexPattern, onsetGrid);

    const velocityPattern = this.getRandomVelocityPattern(arpeggioPattern);

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

    for (let i = 0; i < numPatterns; i++) {
      const patternOffset = patternDuration * i + timeOffset;
      for (let e = 0; e < arpeggioPattern.length; e++) {
        const event = arpeggioPattern[e];
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
          notes: event.indices.map((index, k) => {
            const note = { ...currentChord!.notes[Math.floor(index * (currentChord!.notes.length - 1))] };
            note.duration = note.duration - (event.onset % note.duration);
            note.velocity = velocityPattern[e][k];
            return note;
          }),
        };

        arpeggioSequence.push(arpChordEvent);
      }
    }
    const lastChordDuration = sortedChords.at(-1)!.notes[0].duration;
    const lastChord = { ...sortedChords.at(-1)!, onset: Math.ceil(arpeggioSequence.at(-1)!.onset / lastChordDuration) * lastChordDuration };
    lastChord.notes.forEach((n) => {
      n.velocity = Math.random() * 0.5 + 0.5;
    });
    arpeggioSequence.push(lastChord);

    return arpeggioSequence;
  }
}
