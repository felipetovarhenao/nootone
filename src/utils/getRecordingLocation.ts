import { Recording, RecordingVariation } from "../types/audio";

type RecordingLocation = {
  parentIndex?: number;
  childIndex?: number;
};

export default function getRecordingLocation(recordings: Recording[], recording: Recording | RecordingVariation): RecordingLocation {
  const isVariation = !("variations" in recording);
  for (let i = 0; i < recordings.length; i++) {
    if (isVariation) {
      for (let j = 0; j < recordings.length; j++) {
        if (recordings[i].variations![j].url !== recording.url) {
          continue;
        }
        return {
          parentIndex: i,
          childIndex: j,
        };
      }
    }
    if (recordings[i].url === recording.url) {
      return {
        parentIndex: i,
      };
    }
  }
  return {};
}
