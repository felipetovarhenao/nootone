export default function pitchToFrequency(pitch: number): number {
  return 2 ** ((pitch - 69) / 12) * 440;
}
