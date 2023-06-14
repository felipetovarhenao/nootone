export default function getRecordingIndexFromPath(input: string): number | null {
  const regex = /\/(\d+)\//;
  const matches = input.match(regex);

  if (matches && matches.length > 1) {
    const numberString = matches[1];
    const number = parseInt(numberString, 10);
    return number;
  }

  return null;
}
