import getAudioSpecs from "./getAudioSpecs";

export default function loadTestRecordings(callback: (rec: any) => void): void {
  const bpmSamples = [65, 70, 90, 99, 117];
  bpmSamples.forEach(async (bpm) => {
    try {
      const res = await fetch(`https://dxbtnxd6vjk30.cloudfront.net/media/tests/${bpm}bpm.mp3`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const { duration, sampleRate } = await getAudioSpecs(blob);
      const rec = {
        url: url,
        name: `${bpm}`,
        duration: duration,
        sampleRate,
        features: {
          tempo: bpm,
        },
        variations: [],
      };
      callback(rec);
    } catch (err) {
      console.log(err);
    }
  });
}
