import { Midi } from "@tonejs/midi";
import downloadURL from "./downloadURL";

export default function downloadMIDI(midi: Midi, name: string): void {
  const midiArray = midi.toArray();
  const midiBlob = new Blob([midiArray]);
  const url = URL.createObjectURL(midiBlob);
  downloadURL(url, `${name}.mid`);
}
