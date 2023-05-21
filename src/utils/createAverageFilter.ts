/**
 * Creates a weighted average filter function.
 * @param filterSize The size of the filter window. Defaults to 7.
 * @returns The weighted average filter function.
 */
export default function createAverageFilter(filterSize: number = 7): (value: number, weight?: number) => number {
  // Array to store the window of values and weights
  const window: { value: number; weight: number }[] = [];

  /**
   * Applies the weighted average filter to the input value.
   * @param value The input value to filter.
   * @param weight The weight of the input value. Defaults to 1.
   * @returns The filtered value.
   */
  return function weightedAverageFilter(value: number, weight: number = 1): number {
    // Add the new value and weight to the window
    window.push({ value, weight });

    // If the window exceeds the filter size, remove the oldest value
    if (window.length > filterSize) {
      window.shift(); // Remove oldest value from FIFO array
    }

    let sum = 0;
    let totalWeight = 0;

    // Calculate the weighted sum and total weight
    for (const item of window) {
      sum += item.value * item.weight;
      totalWeight += item.weight;
    }

    // Calculate and return the weighted average
    return sum / totalWeight;
  };
}
