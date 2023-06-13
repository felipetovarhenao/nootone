import { Midi } from "@tonejs/midi";
import { ChordEvent } from "../types/music";

export default function createMidiFile(chordEvents: ChordEvent[], tempo: number): Midi {
  // Create a new MIDI object
  const midi = new Midi();

  // Set the tempo
  midi.header.setTempo(tempo);

  // Create a new track
  const track = midi.addTrack();

  // Iterate over the note events
  chordEvents.forEach((chord) => {
    chord.notes.forEach((event) => {
      const { pitch, duration, velocity } = event;

      // Convert the onset and duration to ticks based on the tempo
      const ticksPerQuarterNote = midi.header.ppq;
      const ticksPerSecond = ticksPerQuarterNote * (tempo / 60);
      const tickOnset = Math.round(chord.onset * ticksPerSecond);
      const tickDuration = Math.round(duration * ticksPerSecond);

      // Add a note on event to the track
      track.addNote({ midi: pitch, ticks: tickOnset, durationTicks: tickDuration, velocity: velocity });
    });
  });

  return midi;
}

export function cleanMidi(midi: Midi): Midi {
  /* Iterate through every track */
  for (let trackID = 0; trackID < midi.tracks.length; trackID++) {
    const track = midi.tracks[trackID];

    /* initialize variables to keep track of chord and onset */
    let currentChord = [];
    let currentOnset = track?.notes[0]?.ticks;
    let vel = 0.5;
    /* Iterate through every note in track */
    for (let noteID = 0; noteID < track?.notes?.length; noteID++) {
      const note = track.notes[noteID];

      /* modify notes in current chord before onset changes */
      if (note.ticks !== currentOnset) {
        /* get legato duration for current chord to avoid sustain overlap */
        const legatoDuration = note.ticks - currentOnset;

        /* get velocity based on chord size and smoothen based on previous velocity */
        vel = vel;

        /* to every note, apply legato duration and assign velocity value based on context */
        currentChord.forEach((note) => {
          /* update duration */
          midi.tracks[note.trackID].notes[note.noteID].durationTicks = legatoDuration;

          /* update velocity */

          midi.tracks[note.trackID].notes[note.noteID].velocity = vel;
        });

        /* reset chord and update onset */
        currentChord = [];
        currentOnset = note.ticks;
      }

      /* keep reference of MIDI track and note id*/
      currentChord.push({
        noteID: noteID,
        trackID: trackID,
      });
    }
  }
  return midi;
}
