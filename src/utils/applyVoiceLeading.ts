import connectChords from "./connectChords";
import removeDuplicates from "./removeDuplicates";

/**
 * Applies voice leading to a sequence of chords.
 *
 * @param chordSequence - The input chord sequence represented as a 2D array of numbers.
 * @returns The chord sequence with voice leading applied, represented as a 2D array of numbers.
 */
export default function applyVoiceLeading(chordSequence: number[][], lowerPitchBound: number = 48, upperPitchBound: number = 85): number[][] {
  const outputChordSequence: number[][] = [chordSequence[0]]; // Initialize the output chord sequence with the first chord

  // Iterate over the remaining chords in the input chord sequence
  for (let i = 1; i < chordSequence.length; i++) {
    const chord = [...chordSequence[i]]; // Create a copy of the current chord
    chord.sort(); // Sort the chord in ascending order

    // Apply voice leading to the base line of the current chord
    const baseLine = connectChords(outputChordSequence[i - 1].slice(0, 1), chord.slice(0, 1), lowerPitchBound, upperPitchBound);

    // Apply voice leading to the upper voices of the current chord
    const upperVoices = connectChords(outputChordSequence[i - 1].slice(1), chord.slice(1), lowerPitchBound, upperPitchBound);

    // Combine the base line and upper voices to form the new chord in the output sequence
    outputChordSequence[i] = removeDuplicates([...baseLine, ...upperVoices]);
  }

  return outputChordSequence; // Return the chord sequence with voice leading applied
}
