import createUniqueTitle from "./createUniqueTitle";
import getAudioSpecs from "./getAudioSpecs";

export default function loadTestRecordings(callback: (rec: any) => void): void {
  const bpmSamples = [53, 57, 60, 64, 65, 70, 75, 77, 89, 90, 92, 93, 94, 99, 105, 110, 113, 113, 117, 121, 122, 123];
  bpmSamples.forEach(async (bpm) => {
    try {
      const res = await fetch(`https://d2cq0goacowtde.cloudfront.net/nootone/media/tests/${bpm}bpm.mp3`);
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
