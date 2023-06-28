import shuffleArray from "./shuffleArray";

/**
 * Connects two chords together using voice leading.
 *
 * @param A - The first chord represented as an array of numbers.
 * @param B - The second chord represented as an array of numbers.
 * @returns The connected chord resulting from voice leading.
 */
export default function connectChords(A: number[], B: number[], lowerPitchBound: number = 36, upperPitchBound: number = 85): number[] {
  if (B.length === 0) {
    return B; // If the second chord is empty, return an empty chord
  }

  const pitchClassesB = shuffleArray(chordToPitchClasses(B)); // Extract the pitch classes from chord B and randomize to prevent deterministic connections
  const visited: number[] = []; // Keep track of visited pitch classes
  let chordB: number[] = []; // Initialize the resulting chord B

  // Iterate over each note in chord A
  for (let i = 0; i < A.length; i++) {
    const pcA = A[i] % 12; // Calculate the pitch class of the current note in chord A
    let closestPitch = 0; // Initialize the closest pitch to 0
    let minDistance = Infinity; // Initialize the minimum distance to Infinity

    // Iterate over each pitch class in chord B
    for (let j = 0; j < pitchClassesB.length; j++) {
      const pcB = pitchClassesB[j]; // Get the current pitch class in chord B

      // Skip the current pitch class if it has been visited and not all pitch classes have been visited yet
      if (visited.includes(pcB) && visited.length < pitchClassesB.length) {
        continue;
      }

      // Calculate the upper and bottom distances between pitch classes A and B
      let upperDistance = (pcB - pcA + 12) % 12;
      let bottomDistance = (12 - upperDistance) * -1;

      // Determine the closest distance and its absolute value
      let closestDistance = Math.abs(upperDistance) < Math.abs(bottomDistance) ? upperDistance : bottomDistance;
      let absClosestDistance = Math.abs(closestDistance);

      // Update the closest pitch and minimum distance if the current distance is smaller
      if (absClosestDistance < minDistance) {
        closestPitch = A[i] + closestDistance;
        if (closestPitch < lowerPitchBound) {
          closestPitch += 12;
        } else if (closestPitch > upperPitchBound) {
          closestPitch -= 12;
        }
        minDistance = absClosestDistance;
      }
    }

    chordB.push(closestPitch); // Add the closest pitch to the resulting chord B

    // Add the pitch class of the closest pitch to the visited list if it hasn't been visited before
    if (!visited.includes(closestPitch % 12)) {
      visited.push(closestPitch % 12);
    }
  }

  const pitchClassesChordB = chordToPitchClasses(chordB); // Extract the pitch classes from the resulting chord B
  const missing = pitchClassesB.filter((x) => !pitchClassesChordB.includes(x)); // Find the missing pitch classes

  // If there are missing pitch classes, recursively connect them to chord A and add them to chord B
  if (missing) {
    chordB.push(...connectChords(A, missing));
  }

  chordB = Array.from(new Set(chordB)); // Remove duplicate pitches from chord B
  chordB.sort(); // Sort the pitches in chord B in ascending order
  return chordB; // Return the connected chord resulting from voice leading
}

/**
 * Converts a chord to its pitch classes.
 *
 * @param chord - The input chord represented as an array of numbers.
 * @returns The pitch classes extracted from the chord.
 */
export function chordToPitchClasses(chord: number[]): number[] {
  return Array.from(new Set(chord.map((x) => x % 12)));
}
