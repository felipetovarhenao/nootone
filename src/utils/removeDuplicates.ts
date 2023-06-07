type EqualityCallback<T> = (a: T, b: T) => boolean;

export default function removeDuplicates<T>(arr: T[], compareFn?: EqualityCallback<T>): T[] {
  if (!compareFn) {
    compareFn = (a: T, b: T) => a === b;
  }

  const result: T[] = [];
  for (const item of arr) {
    if (!result.some((x) => compareFn!(x, item))) {
      result.push(item);
    }
  }

  return result;
}
