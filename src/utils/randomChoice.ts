/**
 * Returns a random element from the given array.
 * @param array The array from which to choose a random element.
 * @returns A random element from the array, or undefined if the array is empty.
 */
export default function randomChoice<T>(array: T[]): T | undefined {
  // Check if the array is empty
  if (array.length === 0) {
    return undefined;
  }

  // Generate a random index within the array's bounds
  const randomIndex = Math.floor(Math.random() * array.length);

  // Retrieve and return the element at the random index
  return array[randomIndex];
}
