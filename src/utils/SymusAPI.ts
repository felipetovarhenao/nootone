export class Note {
  public pitch: number;
  /**
   * Represents a musical note.
   * @param pitch - The pitch of the note.
   */
  constructor(pitch: number) {
    this.pitch = pitch;
  }

  /**
   * Returns the pitch class of the note.
   * @returns The pitch class.
   */
  public getPitchClass(): number {
    return this.pitch % 12;
  }

  /**
   * Converts the note to a NoteEvent.
   * @param onset - The onset time of the note event. Default is 0.
   * @param duration - The duration of the note event. Default is 1.
   * @returns A new NoteEvent instance.
   */
  public toNoteEvent(onset: number = 0, duration: number = 1) {
    return new NoteEvent(this.pitch, onset, duration);
  }
}

export class NoteEvent extends Note {
  public onset: number;
  public duration: number;

  /**
   * Represents a musical note event.
   * @param pitch - The pitch of the note event.
   * @param onset - The onset time of the note event. Default is 0.
   * @param duration - The duration of the note event. Default is 1.
   */
  constructor(pitch: number, onset: number = 0, duration: number = 1) {
    super(pitch);
    this.onset = onset;
    this.duration = duration;
  }

  /**
   * Converts the NoteEvent to a JSON object.
   * @returns The JSON representation of the NoteEvent.
   */
  public toJSON(): any {
    return {
      pitch: this.pitch,
      onset: this.onset,
      duration: this.duration,
    };
  }

  /**
   * Creates a NoteEvent instance from a JSON object.
   * @param json - The JSON object representing a NoteEvent.
   * @returns A new NoteEvent instance.
   */
  public static fromJSON(json: any): NoteEvent {
    const { pitch, onset = 0, duration = 1 } = json;
    return new NoteEvent(pitch, onset, duration);
  }

  /**
   * Converts the NoteEvent to a Note.
   * @returns A new Note instance.
   */
  public toNote(): Note {
    return new Note(this.pitch);
  }
}

export class Chord {
  public notes: Note[];

  /**
   * Represents a musical chord.
   * @param notes - The notes in the chord.
   */
  constructor(notes: Note[]) {
    this.notes = notes;
  }
}

export class ChordEvent {
  public noteEvents: NoteEvent[];
  public onset: number;

  /**
   * Represents a musical chord event.
   * @param noteEvents - The note events in the chord event.
   */
  constructor(noteEvents: NoteEvent[]) {
    this.checkOnsets(noteEvents);
    this.noteEvents = noteEvents;
    this.onset = this.noteEvents[0].onset;
  }

  /**
   * Checks if the note events have different onsets.
   * @param noteEvents - The note events to check.
   * @throws An error if the note events have different onsets.
   */
  private checkOnsets(noteEvents: NoteEvent[]): void {
    const onsetSet = new Set<number>();
    for (let i = 0; i < noteEvents.length; i++) {
      const noteEvent = noteEvents[i];
      if (onsetSet.has(noteEvent.onset)) {
        throw new Error("Note events have different onsets.");
      }
      onsetSet.add(noteEvent.onset);
    }
  }

  /**
   * Converts the ChordEvent to a JSON object.
   * @returns The JSON representation of the ChordEvent.
   */
  public toJSON(): any {
    return {
      noteEvents: this.noteEvents.map((noteEvent) => noteEvent.toJSON()),
      onset: this.onset,
    };
  }

  /**
   * Creates a ChordEvent instance from a JSON object.
   * @param json - The JSON object representing a ChordEvent.
   * @returns A new ChordEvent instance.
   */
  public static fromJSON(json: any): ChordEvent {
    const noteEvents = json.noteEvents.map((noteEventJSON: any) => NoteEvent.fromJSON(noteEventJSON));
    return new ChordEvent(noteEvents);
  }

  /**
   * Creates a ChordEvent instance from an array of pitches.
   * @param pitches - The pitches of the notes in the chord event.
   * @param onset - The onset time of the chord event. Default is 0.
   * @param durations - The durations of the notes in the chord event. Default is [1].
   * @returns A new ChordEvent instance.
   */
  static fromPitchArray(pitches: number[], onset: number = 0, durations: number[] = [1]): ChordEvent {
    const noteEvents = pitches.map((pitch, i) => new NoteEvent(pitch, onset, durations[Math.min(i, durations.length - 1)]));
    return new ChordEvent(noteEvents);
  }
}

export class ChordEventSequence {
  chordEvents: ChordEvent[];

  /**
   * Represents a sequence of musical chord events.
   * @param chordEvents - The chord events in the sequence.
   */
  constructor(chordEvents: ChordEvent[]) {
    this.checkOnsets(chordEvents);
    this.chordEvents = chordEvents;
  }

  /**
   * Checks if the chord events have duplicate onsets.
   * @param chordEvents - The chord events to check.
   * @throws An error if the chord events have duplicate onsets.
   */
  private checkOnsets(chordEvents: ChordEvent[]): void {
    const onsetSet = new Set<number>();
    for (let i = 0; i < chordEvents.length; i++) {
      const chordEvent = chordEvents[i];
      const onset = chordEvent.onset;
      if (onsetSet.has(onset)) {
        throw new Error("Chords have duplicate onsets.");
      }
      onsetSet.add(onset);
    }
  }

  /**
   * Converts the ChordEventSequence to a JSON object.
   * @returns The JSON representation of the ChordEventSequence.
   */
  public toJSON(): any {
    return {
      chordEvents: this.chordEvents.map((chordEvent) => chordEvent.toJSON()),
    };
  }

  /**
   * Creates a ChordEventSequence instance from a JSON object.
   * @param json - The JSON object representing a ChordEventSequence.
   * @returns A new ChordEventSequence instance.
   */
  public static fromJSON(json: any): ChordEventSequence {
    const chordEvents = json.chordEvents.map((chordEventJSON: any) => ChordEvent.fromJSON(chordEventJSON));
    return new ChordEventSequence(chordEvents);
  }
}
