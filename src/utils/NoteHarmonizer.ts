import KDTree from "./KDTree";

export default class NoteHarmonizer {
  private keySignatureChromaVectors: number[][];
  private keySignatureTree: KDTree;
  private chordChromaVectors: number[][] | null;
  private chordChromaTree: KDTree | null;
  private chordCollection: number[][] | string | null;

  private static CHORD_COLLECTIONS: { [key: string]: number[][] } = {
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
      [11, 4, 0, 7], // MM7
      [10, 4, 0, 7], // Mm7
      [10, 3, 0, 7], // mm7
      [10, 3, 6, 0], // º7 (half)
      [6, 4, 0, 7, 10], // Mm7#11
      [6, 4, 0, 7, 11], // MM7#11
      [2, 4, 0, 7, 11], // MM7-M9
      [2, 4, 0, 7, 10], // Mm7-M9
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

  constructor() {
    this.keySignatureChromaVectors = this.getKeySignatureChromaVectors();
    this.keySignatureTree = new KDTree(this.keySignatureChromaVectors[0].length);
    this.keySignatureTree.fit(this.keySignatureChromaVectors);

    this.chordChromaVectors = null;
    this.chordChromaTree = null;
    this.chordCollection = null;
  }

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

  private noteArrayToSegments(notes: NoteEvent[], segSize: number): Segment[] {
    const segments: Segment[] = [];
    let segment: NoteEvent[] = [];
    let lastSegmentIndex = Math.floor(notes[0].onset / segSize);

    for (const note of notes) {
      const segmentIndex = Math.floor(note.onset / segSize);

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

  private noteArrayToChroma(notes: NoteEvent[], segSize: number): number[] {
    const chroma: number[] = new Array(12).fill(0);

    for (const note of notes) {
      const index = note.pitch % 12;
      chroma[index] += note.duration * this.getMetricWeight(note.onset, segSize);
    }

    const maxChroma = Math.max(...chroma);
    return chroma.map((value) => value / maxChroma);
  }
  private estimateKeyFromSegments(segments: Segment[], segSize: number): number[] {
    const noteArray: NoteEvent[] = [];

    // create note array from segments
    for (const seg of segments) {
      noteArray.push(...seg.notes);
    }

    // generate chroma vector from note array
    const segmentChromaVector = this.noteArrayToChroma(noteArray, segSize);

    // get most similar key signature vector
    return this.keySignatureTree.query(segmentChromaVector)[0];
  }

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

  private getChordChromaVectors(chordCollection: number[][], keySignatureEmbedding: number = 0.1): number[][] {
    const maxChordSize = Math.max(...chordCollection.map((c) => c.length));
    const weights = Array.from({ length: maxChordSize }, (_, i) => 1 / 1.125 ** i);
    const weightsMatrix = weights.map((weight) => [weight]);
    const onsets = Array.from({ length: maxChordSize }, () => [0]);

    const chordChromaVectors: number[][] = [];

    for (let root = 0; root < 12; root++) {
      for (const chordType of chordCollection) {
        for (const keySig of this.keySignatureChromaVectors) {
          const chord = chordType.map((note) => (note + root) % 12);
          const notes: NoteEvent[] = chord.map((pitch, i) => ({
            onset: onsets[i][0],
            duration: weightsMatrix[i][0],
            pitch,
          }));

          const chroma = this.noteArrayToChroma(notes, 1);
          const embeddedChroma = chroma.map((value, index) => value * (1 - keySignatureEmbedding) + keySig[index] * keySignatureEmbedding);

          chordChromaVectors.push(embeddedChroma);
        }
      }
    }

    return chordChromaVectors;
  }

  private getChordCollection(collection: string): number[][] {
    const collectionName = collection.toLowerCase();
    if (!(collectionName in NoteHarmonizer.CHORD_COLLECTIONS)) {
      throw new Error(`Invalid collection name: ${collectionName}`);
    }
    return NoteHarmonizer.CHORD_COLLECTIONS[collectionName];
  }

  private setChordCollection(chordCollection: number[][] | string, keySignatureEmbedding: number = 0.1): void {
    if (typeof chordCollection === "string") {
      chordCollection = this.getChordCollection(chordCollection);
      this.chordCollection = chordCollection;
    } else if (Array.isArray(chordCollection)) {
      this.chordCollection = "custom";
    } else {
      throw new Error("Invalid type for chordCollection parameter");
    }

    this.chordChromaVectors = this.getChordChromaVectors(chordCollection, keySignatureEmbedding);
    this.chordChromaTree = new KDTree(this.chordChromaVectors[0].length);
  }

  private predictChordFromChromaVector(chroma: number[], activationThreshold: number = 0.25): number[] {
    if (!this.chordChromaTree) {
      throw new Error("chordChromaTree is null");
    }
    const vector = this.chordChromaTree.query(chroma)[0];
    return this.chromaVectorToChord(vector, activationThreshold);
  }

  private chordToNoteArray(chord: number[], onset: number, duration: number, velocity: number): NoteEvent[] {
    return chord.map((pitch) => ({
      onset: onset,
      pitch: pitch,
      duration: duration,
      velocity: velocity,
    }));
  }

  harmonize(
    noteArray: NoteEvent[],
    chordCollection: number[][] | string = "classical",
    segSize: number = 2,
    harmonicMemory: number = 0.125,
    keySignatureWeight: number = 0.25,
    lookAhead: number = 2,
    harmonicConsonance: number = 0.5
  ): NoteEvent[] {
    if (this.chordCollection !== chordCollection) {
      this.setChordCollection(chordCollection, keySignatureWeight);
    }

    const harmonicArray: NoteEvent[] = [];
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

      // convert chord to note array and append to harmonic array
      const chordNoteArray = this.chordToNoteArray(chord, seg.onset, segSize, 0.4);
      harmonicArray.push(...chordNoteArray);

      // keep track of previous chroma
      lastChroma = chroma;
    }
    return harmonicArray;
  }
}

interface NoteEvent {
  pitch: number;
  onset: number;
  duration: number;
  velocity?: number;
}

interface Segment {
  onset: number;
  notes: NoteEvent[];
}
