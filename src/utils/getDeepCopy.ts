export default function getDeepCopy<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}
