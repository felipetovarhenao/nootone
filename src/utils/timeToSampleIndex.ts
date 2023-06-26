export function timeToSampleIndex(time: number, sampleRate: number, hopSize: number) {
  return Math.floor((time * sampleRate) / hopSize);
}
