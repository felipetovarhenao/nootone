import euclideanDistance from "./euclideanDistance";
import rotateArray from "./rotateArray";

type KeySignaturePrediction = {
  root: number;
  isMajor: boolean;
};

export default function detectKeySignature(chroma: number[]): KeySignaturePrediction {
  const majorChromaKeys = [...Array(12).keys()].map((i) => rotateArray([1, 0, 0.5, 0, 0.8, 0.6, 0, 0.9, 0, 0.4, 0, 0.7], i));
  const minorChromaKeys = [...Array(12).keys()].map((i) => rotateArray([1, 0, 0.5, 0.8, 0, 0.6, 0, 0.9, 0.4, 0, 0.35, 0.35], i));

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
