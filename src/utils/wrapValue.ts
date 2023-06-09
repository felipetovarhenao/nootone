export default function wrapValue(x: number, N: number) {
  const y = x % N;
  return y < 0 ? N + y : y;
}
