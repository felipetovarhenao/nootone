export default function fillPitchRange(pitchClasses: number[], minPitch: number, maxPitch: number): number[] {
  if (maxPitch <= minPitch) {
    throw new Error("maxPitch must be greater than minPitch");
  } else if (maxPitch - minPitch < 12) {
    throw new Error("difference between minPitch and maxPitch must be at least an octave");
  }
  let pitchRange = [];
  const octaveOffset = Math.floor(minPitch / 12) * 12;
  for (let i = 0; i < pitchClasses.length; i++) {
    let pitch = (pitchClasses[i] % 12) + octaveOffset;
    while (pitch < maxPitch) {
      if (pitch >= minPitch) {
        pitchRange.push(pitch);
      }
      pitch += 12;
    }
  }
  return pitchRange.sort();
}
