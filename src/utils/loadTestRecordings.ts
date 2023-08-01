import createUniqueTitle from "./createUniqueTitle";
import getAudioSpecs from "./getAudioSpecs";

export default function loadTestRecordings(callback: (rec: any) => void): void {
  const bpmSamples = [60, 121, 105, 77, 110, 75, 90, 94, 113, 122, 123, 65, 70, 99, 117];
  bpmSamples.forEach(async (bpm) => {
    try {
      const res = await fetch(`https://dxbtnxd6vjk30.cloudfront.net/media/tests/${bpm}bpm.mp3`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const { duration, sampleRate } = await getAudioSpecs(blob);
      const rec = {
        url: url,
        name: `${bpm}bpm - ${createUniqueTitle()}`,
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
