const getRMS = (frame: Float32Array) => {
  let sumOfSquares = 0;

  for (let i = 0; i < frame.length; i++) {
    const sample = frame[i];
    sumOfSquares += sample * sample;
  }

  const meanSquare = sumOfSquares / frame.length;
  const rms = Math.sqrt(meanSquare);

  return rms;
};

export default getRMS;
