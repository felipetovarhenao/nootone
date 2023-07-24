export default function euclideanDistance(x: number[], y: number[], weights?: number[]) {
  if (x.length !== y.length || (weights && (weights.length !== x.length || weights.length !== y.length))) {
    throw new Error(`Both arrays must have the same length (x: ${x.length}; y: ${y.length}`);
  }

  let sum = 0;

  for (let i = 0; i < x.length; i++) {
    const diff = x[i] - y[i];
    const weight = weights ? weights[i] : 1;
    sum += diff * diff * weight;
  }

  return Math.sqrt(sum);
}
