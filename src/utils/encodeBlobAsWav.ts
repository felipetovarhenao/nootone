import audioBufferToBlob from "./audioBufferToBlob";
import blobToAudioBuffer from "./blobToAudioBuffer";
import createNewAudioContext from "./createNewAudioContext";

export default async function encodeBlobAsWav(blob: Blob): Promise<Blob> {
  const ctx = createNewAudioContext();
  return blobToAudioBuffer(blob)
    .then((audioBuffer) => audioBufferToBlob(audioBuffer, createNewAudioContext().sampleRate))
    .finally(() => {
      ctx.close();
    });
}
