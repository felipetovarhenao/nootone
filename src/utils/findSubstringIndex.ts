export default function findSubstringIndex(str: string, substrings: string[]): number {
  for (let i = 0; i < substrings.length; i++) {
    if (str.includes(substrings[i])) {
      return i;
    }
  }
  return -1; // If no match is found
}
