export default function findNearestValue(list: number[], target: number): [value: number, index: number] {
  let left = 0;
  let right = list.length - 1;

  // Edge cases where the target is smaller than the smallest element or
  // larger than the largest element in the list
  if (target < list[0]) {
    return [list[0], 0];
  }
  if (target > list[right]) {
    return [list[right], right];
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (list[mid] === target) {
      return [target, mid];
    }

    if (target < list[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  // At this point, left and right have crossed each other
  // left is the index of the element greater than the target
  // right is the index of the element smaller than the target
  const nearestIndex = Math.abs(list[left] - target) < Math.abs(list[right] - target) ? left : right;
  return [list[nearestIndex], nearestIndex];
}
