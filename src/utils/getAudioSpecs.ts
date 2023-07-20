type AudioSpecs = { duration: number; sampleRate: number };

export default function getAudioSpecs(blob: Blob): Promise<AudioSpecs> {
  return new Promise<AudioSpecs>((resolve, reject) => {
    const audioContext = new AudioContext();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;

      audioContext.decodeAudioData(
        arrayBuffer,
        (audioBuffer: AudioBuffer) => {
          const duration = audioBuffer.duration;
          const sampleRate = audioBuffer.sampleRate;
          audioContext.close();
          resolve({ duration, sampleRate });
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
