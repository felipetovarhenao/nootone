export default function createMedianFilter(filterSize: number = 7): (value: number) => number {
  const window: number[] = [];

  return function medianFilter(value: number): number {
    window.push(value);

    if (window.length > filterSize) {
      window.shift(); // Remove oldest value from FIFO array
    }

    const sortedWindow = [...window].sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedWindow.length / 2);

    if (sortedWindow.length % 2 === 0) {
      const median = (sortedWindow[middleIndex - 1] + sortedWindow[middleIndex]) / 2;
      return median;
    } else {
      return sortedWindow[middleIndex];
    }
  };
}
