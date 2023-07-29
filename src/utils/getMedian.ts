export default function getMedian(array: number[] | Float32Array): number {
  const sortedArray = array.slice().sort((a, b) => a - b);
  const middleIdx = Math.floor(sortedArray.length / 2);
  if (sortedArray.length % 2 === 0) {
    return (sortedArray[middleIdx] + sortedArray[middleIdx - 1]) / 2;
  } else {
    return sortedArray[middleIdx];
  }
}
