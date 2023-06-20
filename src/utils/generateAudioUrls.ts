export default function generateAudioUrls(instrumentName: string, minValue: number, maxValue: number, increment: number = 6): string[] {
  const urls: string[] = [];
  let value = minValue;

  while (value <= maxValue) {
    urls.push(`instruments/${instrumentName}/${value}-f.mp3`);
    urls.push(`instruments/${instrumentName}/${value}-p.mp3`);
    value += increment;
  }

  return urls;
}
