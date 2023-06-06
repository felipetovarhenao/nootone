import createNewAudioContext from "./createNewAudioContext";
/**
 * Loads an audio file's URL into an audio array.
 *
 * @param url - The URL of an audio file.
 * @param onSuccess - A callback function called when the conversion is successful.
 *                    It receives the audio data as a Float32Array and a sample rate.
 * @param onError - An optional callback function called if an error occurs during conversion.
 *                  It receives the error object.
 * @param sampleRate - An optional parameter specifying the sample rate of the audio file.
 */
export default async function audioArrayFromURL(url: string, sampleRate?: number): Promise<BufferObject> {
  const audioContext = createNewAudioContext(sampleRate);
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer))
    .then((audioBuffer) => {
      return {
        array: audioBuffer.getChannelData(0),
        sampleRate: audioContext.sampleRate,
      };
    })
    .catch((error) => {
      return error;
    })
    .finally(() => audioContext.close());
}

type BufferObject = {
  array: Float32Array;
  sampleRate: number;
};
