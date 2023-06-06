// export default async function getAudioDuration(blob: Blob): Promise<number> {
//   return new Promise<number>((resolve, reject) => {
//     const audioElement = new Audio();
//     audioElement.addEventListener("loadedmetadata", () => {
//       resolve(audioElement.duration);
//     });
//     audioElement.addEventListener("error", (error) => {
//       reject(error);
//     });
//     audioElement.src = URL.createObjectURL(blob);
//   });
// }

export default function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const audioContext = new AudioContext();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;

      audioContext.decodeAudioData(
        arrayBuffer,
        (audioBuffer: AudioBuffer) => {
          const duration = audioBuffer.duration;
          audioContext.close();
          resolve(duration);
        },
        (error: DOMException) => {
          audioContext.close();
          reject(error);
        }
      );
    };

    fileReader.onerror = () => {
      reject(new Error("Failed to read audio file"));
    };

    fileReader.readAsArrayBuffer(blob);
  });
}
