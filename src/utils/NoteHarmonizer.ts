import KDTree from "./KDTree";
import { ChordEvent, NoteEvent, NoteEventSegment } from "../types/music";

/**
 * NoteHarmonizer class that harmonizes a given note array based on chord collections and key signatures.
 */
export default class NoteHarmonizer {
  private keySignatureChromaVectors: number[][];
  private keySignatureTree: KDTree;
  private chordChromaVectors: number[][] | null;
  private chordChromaTree: KDTree | null;
  private chordCollection: number[][] | string | null;

  static CHORD_COLLECTIONS: { [key: string]: number[][] } = {
    traditional: [
      [0, 7, 3], // m
      [0, 7, 4], // M
      [0, 7, 4, 10], // Mm7
    ],
    pop: [
      [0, 7, 3, 5], // m+P4
      [0, 7, 4, 5], // M+P4
      [0, 7, 4, 10], // Mm7
      [0, 7, 3, 10], // mm7
      [0, 7, 4, 10], // MM7
      [0, 7, 4, 9], // MM6
      [0, 7, 2, 4], // MM9
      [0, 7, 2, 3], // mM9
    ],
    medieval: [
      [5, 0], // P4
      [0, 7], // P5
    ],
    ethereal: [
      [0, 7, 5], // sus4
      [0, 7, 2], // sus2
      [0, 5, 10], // P4 stack
    ],
    upbeat: [
      [4, 0, 7], // M
      [4, 7, 0], // M
      [0, 4, 7], // M
      [0, 7, 4], // M
      [7, 4, 0], // M
      [7, 0, 4], // M
    ],
    dramatic: [
      [3, 0, 7], // m
      [3, 7, 0], // m
      [0, 3, 7], // m
      [0, 7, 3], // m
      [7, 3, 0], // m
      [7, 0, 3], // m
    ],
    mysterious: [
      [4, 0, 8],
      [2, 0, 8],
      [6, 0, 8],
      [6, 0, 10],
    ],
    classical: [
      [0, 7, 4], // M
      [0, 7, 3], // m
      [0, 7, 4, 10], // Mm7
      [0, 7, 3, 10], // mm7
      [3, 0, 6], // º
      [3, 0, 6, 9], // º7
      [3, 0, 6, 10], // º7 (half)
      [2, 0, 6, 9], // aug6 german
      [2, 0, 6], // aug6 italian
      [2, 0, 6, 8], // aug6 french
    ],
    blues: [
      [0, 4, 7, 10], // MM7
      [3, 6, 0, 9], // º7
    ],
    impressionistic: [
      [0, 4, 7], // M
      [0, 7, 3], // m
      [0, 8, 4], // aug
      [2, 0, 6], // aug6 italian
      [2, 0, 6, 8], // aug6 french
      [3, 0, 6, 10], // º7 (half)
      [9, 3, 0, 6], // º7 (half)
    ],
    jazz: [
      [0, 11, 4, 7], // MM7
      [0, 10, 4, 7], // Mm7
      [0, 10, 3, 7], // mm7
      [0, 2, 4, 7, 10], // Mm7-M9
      [0, 2, 4, 7, 11], // MM7-M9
      [0, 6, 4, 7, 10], // Mm7-#11
      [0, 10, 6, 3], // º7 (half)
    ],
    bittersweet: [
      [0, 7, 4, 5], // M+P4
      [0, 7, 2, 3], // mM9
      [0, 7, 3, 5], // m+P4
      [0, 7, 4, 6], // M#11
      [0, 7, 3, 8], // Mm6
    ],
    dissonant: [
      [6, 0, 1], // 016
      [0, 5, 6], // 016 (inv.)
      [7, 0, 1], // 017
      [0, 6, 7], // 017 (inv.)
      [4, 0, 1, 6], // 0146
      [0, 3, 4, 6], // 0146 (inv.)
    ],
    mystical: [
      [11, 0, 4, 7, 6], // MM7#11
      [3, 0, 4, 7, 6], // M#9#11
      [3, 0, 6, 2, 10], // half º7M9
      [0, 4, 7, 9], // MM6
      [10, 0, 4, 7, 6], // Mm7#11
      [3, 0, 4, 7, 11], // M#9M7
      [3, 0, 4, 7, 6], // M#9#11
    ],
  };

  /**
   * Constructs a new instance of NoteHarmonizer.
   */
  constructor() {
    this.keySignatureChromaVectors = this.getKeySignatureChromaVectors();
    this.keySignatureTree = new KDTree(this.keySignatureChromaVectors);

    this.chordChromaVectors = null;
    this.chordChromaTree = null;
    this.chordCollection = null;
  }

  /**
   * Returns the chroma vectors for all possible major and minor keys.
   * @returns {number[][]} An array of chroma vectors.
   */
  private getKeySignatureChromaVectors(): number[][] {
    /* Returns a chroma vector for all possible major and minor keys */
    const majorKeySignature: number[] = [7, 0, 2, 0, 5, 3, 0.5, 6, 0, 1, 0, 4].map((value) => value / 7);
    const minorKeySignature: number[] = [7, 0, 2, 5, 0, 3, 0.5, 6, 1, 0, 0.5, 4].map((value) => value / 7);
    const keySignaturesChromas: number[][] = [];

    for (const mode of [majorKeySignature, minorKeySignature]) {
      for (let i = 0; i < mode.length; i++) {
        keySignaturesChromas.push([...mode.slice(i), ...mode.slice(0, i)]);
      }
    }

    return keySignaturesChromas;
  }

  /**
   * Converts a note array into segments of specified size.
   * @param {NoteEvent[]} notes - The input note array.
   * @param {number} segSize - The size of segments.
   * @returns {NoteEventSegment[]} An array of segments.
   */
  private noteArrayToSegments(noteEvents: NoteEvent[], segSize: number): NoteEventSegment[] {
    const segments: NoteEventSegment[] = [];
    let segment: NoteEvent[] = [];
    const notes = [...noteEvents].sort((a, b) => a.onset - b.onset);
    const margin = 0.01;
    let lastSegmentIndex = Math.floor(notes[0].onset / segSize + margin);

    for (const note of notes) {
      const segmentIndex = Math.floor(note.onset / segSize + margin);

      if (segmentIndex > lastSegmentIndex) {
        segments.push({ notes: segment, onset: lastSegmentIndex * segSize });
        lastSegmentIndex = segmentIndex;
        segment = [];
      }

      segment.push(note);
    }

    if (segment.length > 0) {
      segments.push({ notes: segment, onset: lastSegmentIndex * segSize });
    }

    return segments;
  }

  /**
   * Computes the weight for a note given its onset within the meter (it assumes the segment size is indicative of the time signature).
   * @param {number} onset - The onset of a note.
   * @param {number} segSize - The size of segments.
   * @returns {number} The weight for the metric.
   */
  private getMetricWeight(onset: number, segSize: number): number {
    const w = (t: number, s: number, i: number): number => {
      const theta = t * 2 ** i * Math.PI * (4 / s);
      return 0.25 * Math.cos(theta) + 0.75;
    };

    let weight = 1;

    for (let i = -1; i <= 1; i++) {
      weight *= w(onset, segSize, i);
    }

    return Math.sqrt(weight);
  }

  /**
   * Converts a note array into a chroma vector.
   * @param {NoteEvent[]} notes - The input note array.
   * @param {number} segSize - The size of segments.
   * @returns {number[]} The chroma vector.
   */
  private noteArrayToChroma(notes: NoteEvent[], segSize: number): number[] {
    const chroma: number[] = new Array(12).fill(0);

    for (const note of notes) {
      const index = note.pitch % 12;
      chroma[index] += note.duration * this.getMetricWeight(note.onset, segSize);
    }

    const maxChroma = Math.max(...chroma);
    return chroma.map((value) => value / maxChroma);
  }

  /**
   * Estimates the key signature from a given array of segments.
   * @param {NoteEventSegment[]} segments - The array of segments.
   * @param {number} segSize - The size of segments.
   * @returns {number[]} The estimated key signature vector.
   */
  private estimateKeyFromSegments(segments: NoteEventSegment[], segSize: number): number[] {
    const noteArray: NoteEvent[] = [];

    // create note array from segments
    for (const seg of segments) {
      noteArray.push(...seg.notes);
    }

    // generate chroma vector from note array
    const segmentChromaVector = this.noteArrayToChroma(noteArray, segSize);

    // get most similar key signature vector
    const detectedKey = this.keySignatureTree.nearestNeighbor(segmentChromaVector) || [];
    return detectedKey;
  }

  /**
   * Converts a chroma vector into a chord based on an activation threshold.
   * @param {number[]} vector - The input chroma vector.
   * @param {number} activationThreshold - The activation threshold.
   * @param {number} offset - The offset for pitch conversion.
   * @returns {number[]} The resulting chord as an array of pitches.
   */
  private chromaVectorToChord(vector: number[], activationThreshold: number, offset: number = 60): number[] {
    // get pitch classes above activation threshold
    const chord: number[] = [];
    vector.forEach((value, index) => {
      if (value > activationThreshold) {
        chord.push(index + offset);
      }
    });
    // append root to chord
    const root = vector.indexOf(Math.max(...vector));
    chord.push(root + offset - 12);

    return Array.from(new Set(chord));
  }

  /**
   * Computes the chord chroma vectors based on a given chord collection and key signature embedding.
   * @param {number[][]} chordCollection - The chord collection.
   * @param {number} keySignatureEmbedding - The key signature embedding value.
   * @returns {number[][]} The chord chroma vectors.
   */
  private getChordChromaVectors(chordCollection: number[][], keySignatureEmbedding: number = 0.1): number[][] {
    const maxChordSize = Math.max(...chordCollection.map((c) => c.length));
    const weights = Array.from({ length: maxChordSize }, (_, i) => 1 / 1.125 ** i);
    const weightsMatrix = weights.map((weight) => [weight]);
    const onsets = Array.from({ length: maxChordSize }, () => [0]);

    const chordChromaVectors: number[][] = [];
    for (let root = 0; root < 12; root++) {
      for (const chordType of chordCollection) {
        const chord = chordType.map((note) => (note + root) % 12);
        const notes: NoteEvent[] = chord.map((pitch, i) => ({
          onset: onsets[i][0],
          duration: weightsMatrix[i][0],
          velocity: weightsMatrix[i][0],
          pitch,
        }));

        const chroma = this.noteArrayToChroma(notes, 1);
        for (const keySig of this.keySignatureChromaVectors) {
          const embeddedChroma = chroma.map((value, index) => value * (1 - keySignatureEmbedding) + keySig[index] * keySignatureEmbedding);
          chordChromaVectors.push(embeddedChroma);
        }
      }
    }
    return chordChromaVectors;
  }

  /**
   * Retrieves the chord collection based on the given collection name.
   * @param {string} collection - The name of the collection.
   * @returns {number[][]} The chord collection.
   * @throws {Error} If an invalid collection name is provided.
   */
  private getChordCollection(collection: string): number[][] {
    const collectionName = collection.toLowerCase();
    if (!(collectionName in NoteHarmonizer.CHORD_COLLECTIONS)) {
      throw new Error(`Invalid collection name: ${collectionName}`);
    }
    return NoteHarmonizer.CHORD_COLLECTIONS[collectionName];
  }

  /**
   * Sets the chord collection and updates the chord chroma vectors.
   * @param {number[][] | string} chordCollection - The chord collection or its name.
   * @param {number} keySignatureEmbedding - The key signature embedding value.
   * @throws {Error} If an invalid chord collection type is provided.
   */
  private setChordCollection(chordCollection: number[][] | string, keySignatureEmbedding: number = 0.1): void {
    if (typeof chordCollection === "string") {
      chordCollection = this.getChordCollection(chordCollection);
    } else if (Array.isArray(chordCollection)) {
      this.chordCollection = "custom";
    } else {
      throw new Error("Invalid type for chordCollection parameter");
    }

    this.chordChromaVectors = this.getChordChromaVectors(chordCollection, keySignatureEmbedding);
    this.chordChromaTree = new KDTree(this.chordChromaVectors);
  }

  /**
   * Predicts the chord based on the given chroma vector and activation threshold.
   * @param {number[]} chroma - The input chroma vector.
   * @param {number} activationThreshold - The activation threshold.
   * @returns {number[]} The predicted chord as an array of pitches.
   */
  private predictChordFromChromaVector(chroma: number[], activationThreshold: number = 0.25): number[] {
    if (!this.chordChromaTree) {
      throw new Error("chordChromaTree is null");
    }
    const vector = this.chordChromaTree.nearestNeighbor(chroma) || [];

    return this.chromaVectorToChord(vector, activationThreshold);
  }

  /**
   * Converts a chord into an array of NoteEvent objects.
   *
   * @param chord - The chord represented as an array of pitches.
   * @param onset - The onset time for the notes in the chord.
   * @param duration - The duration of the notes in the chord.
   * @param velocity - The velocity (loudness) of the notes in the chord.
   * @returns An array of NoteEvent objects representing the individual notes of the chord.
   */
  private chordToNoteArray(chord: number[], onset: number, duration: number, velocity: number): ChordEvent {
    return {
      onset: onset,
      notes: chord.map((pitch) => ({
        duration: duration,
        velocity: velocity,
        pitch: pitch,
      })),
    };
  }

  /**
   * Harmonizes the given note array using the specified chord collection and key signature embedding.
   * @param {NoteEvent[]} noteArray - The input note array.
   * @param {string | number[][]} chordCollection - The chord collection or its name.
   * @param {number} segSize - The size of harmonic segments.
   * @param {number} keySignatureWeight - The key signature embedding value.
   * @param {number} lookAhead - Number of segments to consider for key detection.
   * @param {number} harmonicConsonance - The note activation threshold for every chord prediction.
   * @returns {NoteEvent[]} The harmonized note array.
   */
  harmonize(
    noteArray: NoteEvent[],
    chordCollection: number[][] | string = "traditional",
    segSize: number = 2,
    harmonicMemory: number = 0.125,
    keySignatureWeight: number = 0.25,
    lookAhead: number = 3,
    harmonicConsonance: number = 0.5
  ): ChordEvent[] {
    if (this.chordCollection !== chordCollection) {
      this.setChordCollection(chordCollection, keySignatureWeight);
    }

    const harmonicArray: ChordEvent[] = [];
    const chordSegments = this.noteArrayToSegments(noteArray, segSize);
    let lastChroma: number[] | null = null;

    for (let i = 0; i < chordSegments.length; i++) {
      const seg = chordSegments[i];

      // get chroma feature from segment
      const chroma = this.noteArrayToChroma(seg.notes, segSize);

      // weighted mix with previous chroma
      if (lastChroma !== null) {
        for (let j = 0; j < chroma.length; j++) {
          chroma[j] = chroma[j] * (1 - harmonicMemory) + lastChroma[j] * harmonicMemory;
        }
      }

      // estimate running key signature vector
      const keySig = keySignatureWeight > 0 ? this.estimateKeyFromSegments(chordSegments.slice(i, i + lookAhead), segSize) : 0;

      // mix with estimated key signature
      const weightedChordChroma = chroma.map((value, index) => {
        const keySigValue = Array.isArray(keySig) ? keySig[index] : keySig;
        return value * (1 - keySignatureWeight) + keySigValue * keySignatureWeight;
      });

      // make chord prediction
      const chord = this.predictChordFromChromaVector(weightedChordChroma, harmonicConsonance);
      chord.sort();

      // convert chord to note array and append to harmonic array
      const chordNoteArray = this.chordToNoteArray(chord, seg.onset, segSize, 0.25);

      harmonicArray.push(chordNoteArray);

      // keep track of previous chroma
      lastChroma = chroma;
    }

    return harmonicArray;
  }
}
