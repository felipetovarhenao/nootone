export default function blobUrlToAudioBuffer(blobUrl: string, callback: (audioData: Float32Array) => void): void {
  fetch(blobUrl)
    .then((response) => response.arrayBuffer())
    .then((buffer) => new AudioContext().decodeAudioData(buffer))
    .then((audioBuffer) => {
      callback(audioBuffer.getChannelData(0));
    })
    .catch((error) => console.error(error));
}
