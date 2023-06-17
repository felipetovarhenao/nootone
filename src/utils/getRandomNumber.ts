export default function getRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Invalid range. The minimum value must be less than the maximum value.");
  }

  const range = max - min;
  const randomNumber = Math.random() * range + min;
  return Math.floor(randomNumber);
}
