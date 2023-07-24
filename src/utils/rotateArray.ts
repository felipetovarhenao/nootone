export default function rotateArray<T>(arr: T[], rotationCount: number): T[] {
  const length = arr.length;
  const rotations = rotationCount % length;

  if (rotations === 0) {
    // No rotation needed, return a copy of the original array
    return [...arr];
  }

  if (rotations < 0) {
    // Convert negative rotations to positive by rotating in the opposite direction
    return rotateArray(arr, length + rotations);
  }

  const rotatedArray: T[] = [];
  for (let i = 0; i < length; i++) {
    const newIndex = (i + rotations) % length;
    rotatedArray[newIndex] = arr[i];
  }

  return rotatedArray;
}
