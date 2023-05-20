const frequencyToPitch = (frequency: number): number => {
  return Math.log2(frequency / 440) * 12 + 69;
};

export default frequencyToPitch;
