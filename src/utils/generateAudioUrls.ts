import { InstrumentName } from "../types/music";
import { DynamicMarking } from "./AudioSampler";

export default function generateAudioUrls(
  instrumentName: InstrumentName,
  minValue: number,
  maxValue: number,
  increment: number = 6,
  dyanmics: DynamicMarking[] = [DynamicMarking.FORTE, DynamicMarking.MEZZOFORTE, DynamicMarking.PIANO]
): string[] {
  const urls: string[] = [];
  let value = minValue;

  while (value <= maxValue) {
    dyanmics.forEach((dyn) => {
      urls.push(`https://dxbtnxd6vjk30.cloudfront.net/instruments/${instrumentName}/${value}-${dyn}.mp3`);
    });
    value += increment;
  }

  return urls;
}
