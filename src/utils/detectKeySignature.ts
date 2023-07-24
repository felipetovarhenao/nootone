import euclideanDistance from "./euclideanDistance";
import rotateArray from "./rotateArray";

type KeySignaturePrediction = {
  root: number;
  isMajor: boolean;
};

export default function detectKeySignature(chroma: number[]): KeySignaturePrediction {
  const $ = (num: number) => num ** 1.5;

  const majorChroma = [11, 0, 5, 4, 9, 7, 3, 10, 2, 6, 1, 8].map((x) => $(x / 11));
  const minorChroma = [11, 0, 5, 9, 4, 7, 3, 10, 6, 2, 4.5, 4.5].map((x) => $(x / 11));

  const majorChromaKeys = [...Array(12).keys()].map((i) => rotateArray(majorChroma, i));
  const minorChromaKeys = [...Array(12).keys()].map((i) => rotateArray(minorChroma, i));

  const majorKeyDistances = majorChromaKeys.map((x) => euclideanDistance(x, chroma));
  const minorKeyDistances = minorChromaKeys.map((x) => euclideanDistance(x, chroma));

  const closestMajorKeyDistance = Math.min(...majorKeyDistances);
  const closestMinorKeyDistance = Math.min(...minorKeyDistances);

  let isMajor = false;
  let root = 0;

  if (closestMajorKeyDistance > closestMinorKeyDistance) {
    isMajor = true;
    root = majorKeyDistances.indexOf(closestMajorKeyDistance);
  } else {
    root = minorKeyDistances.indexOf(closestMinorKeyDistance);
  }

  return {
    root,
    isMajor,
  };
}
