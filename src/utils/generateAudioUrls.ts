import { InstrumentName } from "../types/music";

export default function generateAudioUrls(instrumentName: InstrumentName, minValue: number, maxValue: number, increment: number = 6): string[] {
  const urls: string[] = [];
  let value = minValue;

  while (value <= maxValue) {
    urls.push(`https://dxbtnxd6vjk30.cloudfront.net/instruments/${instrumentName}/${value}-f.mp3`);
    urls.push(`https://dxbtnxd6vjk30.cloudfront.net/instruments/${instrumentName}/${value}-mf.mp3`);
    urls.push(`https://dxbtnxd6vjk30.cloudfront.net/instruments/${instrumentName}/${value}-p.mp3`);
    value += increment;
  }

  return urls;
}
