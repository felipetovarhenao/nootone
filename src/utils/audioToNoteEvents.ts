import { BasicPitch, noteFramesToTime, addPitchBendsToNoteEvents, outputToNotesPoly } from "@spotify/basic-pitch";
import { NoteEvent } from "./playNoteEvents";

type onSuccessType = (notes: NoteEvent[]) => void;
type onFailType = (error: any) => void;

export default async function audioToNoteEvents(audioURL: string, onSuccess: onSuccessType, onFail?: onFailType): Promise<void> {
  const audioContext = new AudioContext({ sampleRate: 22050 });

  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];
  let percent: number;

  try {
    const response = await fetch(audioURL);
    const arrayBuffer = await response.arrayBuffer();
    const decodedData = await audioContext.decodeAudioData(arrayBuffer);

    const basicPitch = new BasicPitch("https://raw.githubusercontent.com/spotify/basic-pitch-ts/main/model/model.json");
    await basicPitch.evaluateModel(
      decodedData,
      (f: number[][], o: number[][], c: number[][]) => {
        frames.push(...f);
        onsets.push(...o);
        contours.push(...c);
      },
      (p: number) => {
        percent = p;
      }
    );
    const notes = noteFramesToTime(addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 1, 0.5)));
    const noteEvents = notes.map((n) => ({
      pitch: n.pitchMidi,
      duration: n.durationSeconds,
      onset: n.startTimeSeconds,
      velocity: n.amplitude,
    }));
    noteEvents.sort((a, b) => a.onset - b.onset || a.pitch - b.pitch);

    onSuccess(noteEvents);
  } catch (error) {
    if (onFail) {
      onFail(error);
    }
  }
}
