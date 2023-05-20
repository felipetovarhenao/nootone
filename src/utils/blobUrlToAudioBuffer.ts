export default function blobUrlToAudioBuffer(blobUrl: string, callback: (audioData: Float32Array, sampleRate: number) => void): void {
  const audioContext = new AudioContext();
  fetch(blobUrl)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer))
    .then((audioBuffer) => {
      callback(audioBuffer.getChannelData(0), audioContext.sampleRate);
    })
    .catch((error) => console.error(error));
}
