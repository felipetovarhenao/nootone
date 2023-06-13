import audioBufferToBlob from "./audioBufferToBlob";
import blobToAudioBuffer from "./blobToAudioBuffer";
import createNewAudioContext from "./createNewAudioContext";

type WavEncoderConfig = {
  normalize?: boolean;
  crossFadeDuration?: number;
  maxdB?: number;
};

export default async function encodeBlobAsWav(blob: Blob, config?: WavEncoderConfig): Promise<Blob> {
  const { normalize = true, crossFadeDuration = 0.05, maxdB = -8 } = config || {};
  const ctx = createNewAudioContext();
  return blobToAudioBuffer(blob)
    .then((audioBuffer) => audioBufferToBlob(audioBuffer, createNewAudioContext().sampleRate, normalize, crossFadeDuration, maxdB))
    .finally(() => {
      ctx.close();
    });
}
