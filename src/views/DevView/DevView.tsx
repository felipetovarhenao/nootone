import { useEffect } from "react";
import NoteHarmonizer from "../../utils/NoteHarmonizer";

interface NoteEvent {
  pitch: number;
  onset: number;
  duration: number;
  velocity?: number;
}

const rawNotes: number[][] = [
  [0, 0.5],
  [7, 0.5],
  [9, 1.5],
  [7, 0.5],
  [7, 1.5],
  [4, 0.5],
  [7, 0.5],
  [5, 0.25],
  [5, 0.75],
  [2, 0.5],
  [0, 0.5],
  [11, 0.5],
  [2, 0.5],
  [-5, 0.5],
  [0, 2],
];
const DevView = () => {
  useEffect(() => {
    let onset = 0;
    const noteEvents: NoteEvent[] = rawNotes.map((n) => {
      const e = { onset, duration: n[1], pitch: n[0] + 72 };
      onset += n[1];
      return e;
    });
    const h = new NoteHarmonizer();
    console.log(h.harmonize(noteEvents));
  }, []);
  return <div></div>;
};

export default DevView;
