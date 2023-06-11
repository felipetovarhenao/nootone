import createNewAudioContext from "./createNewAudioContext";

export default async function blobToAudioBuffer(blob: Blob): Promise<AudioBuffer> {
  const arrayBuffer = await readBlob(blob);

  const audioContext = createNewAudioContext();

  return audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => audioBuffer);
}

async function readBlob(blob: Blob): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        const result = reader.result as ArrayBuffer;
        resolve(result);
      }
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(blob);
  });
}
