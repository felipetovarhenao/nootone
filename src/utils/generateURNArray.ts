export default function generateURNArray(arraySize: number, vocabSize: number): number[] {
  if (arraySize > vocabSize) {
    const result: number[] = [];
    while (result.length < arraySize) {
      const subArray = generateURNArray(Math.min(arraySize - result.length, vocabSize), vocabSize);
      result.push(...subArray);
    }
    return result;
  }

  const result: number[] = [];
  const availableNumbers: Set<number> = new Set();

  while (result.length < arraySize) {
    const randomNumber = Math.floor(Math.random() * vocabSize);
    if (!availableNumbers.has(randomNumber)) {
      result.push(randomNumber);
      availableNumbers.add(randomNumber);
    }
  }

  return result;
}
