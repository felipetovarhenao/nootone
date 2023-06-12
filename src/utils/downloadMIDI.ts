import { Midi } from "@tonejs/midi";

export default function downloadMIDI(midi: Midi, name: string): void {
  const midiArray = midi.toArray();
  const midiBlob = new Blob([midiArray]);
  const link = document.createElement("a");
  const url = URL.createObjectURL(midiBlob);
  link.href = url;
  link.download = `${name}.mid`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
