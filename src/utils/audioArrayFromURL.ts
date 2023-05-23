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
export default function audioArrayFromURL(
  url: string,
  onSuccess: (audioData: Float32Array, sampleRate: number) => void,
  onError?: (error: any) => void,
  sampleRate?: number
): void {
  const audioContext = createNewAudioContext(sampleRate);
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer))
    .then((audioBuffer) => {
      onSuccess(audioBuffer.getChannelData(0), audioContext.sampleRate);
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    })
    .finally(() => audioContext.close());
}
