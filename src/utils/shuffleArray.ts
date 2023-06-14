export default function shuffleArray<T>(arr: T[]): T[] {
  // Create a shallow copy of the original array
  const copy = [...arr];

  // Fisher-Yates shuffle algorithm
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
