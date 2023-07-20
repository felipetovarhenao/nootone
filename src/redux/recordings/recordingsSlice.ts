import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import harmonizeThunk from "./harmonizeThunk";
import harmonizeReducers from "./harmonizeReducers";
import { Recording, RecordingVariation } from "../../types/audio";
import getRecordingLocation from "../../utils/getRecordingLocation";
import getTempoTags from "../../utils/getTempoTags";
import getDurationTags from "../../utils/getDurationTags";

export type InitialState = {
  isProcessing: boolean;
  selectedRecordingIndex: number | null;
  recordings: Recording[];
  variationBuffer: RecordingVariation | null;
  keptVariationsBuffer: RecordingVariation[];
};

const initialState: InitialState = {
  isProcessing: false,
  selectedRecordingIndex: null,
  variationBuffer: null,
  keptVariationsBuffer: [],
  recordings: [],
};

const recordings = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    create: (state, action: PayloadAction<Omit<Recording, "tags" | "date" | "variations">>) => {
      action.payload.url;
      state.recordings.unshift({
        tags: [...getTempoTags(action.payload.features.tempo), ...getDurationTags(action.payload.duration)],
        variations: [],
        date: new Date().toLocaleString(),
        ...action.payload,
      });
    },
    updateTitle: (state, action: PayloadAction<{ recording: Recording | RecordingVariation; title: Recording["name"] }>) => {
      const { recording, title } = action.payload;
      const { parentIndex, childIndex } = getRecordingLocation(state.recordings, recording);
      if (parentIndex === undefined) {
        throw Error("Recording not found");
      }
      if (childIndex === undefined) {
        state.recordings[parentIndex].name = title;
      } else {
        state.recordings[parentIndex].variations[childIndex].name = title;
      }
    },
    selectRecording: (state, action: PayloadAction<number>) => {
      state.selectedRecordingIndex = action.payload;
    },
    keepVariation: (state) => {
      if (state.selectedRecordingIndex !== null && state.variationBuffer) {
        state.recordings[state.selectedRecordingIndex].variations.unshift(state.variationBuffer);
        state.keptVariationsBuffer.push(state.variationBuffer);
        state.variationBuffer = null;
      }
    },
    delete: (state, action: PayloadAction<Recording | RecordingVariation>) => {
      const { parentIndex, childIndex } = getRecordingLocation(state.recordings, action.payload);
      if (parentIndex === undefined) {
        throw Error("Recording not found");
      }
      if (childIndex !== undefined) {
        state.recordings[parentIndex].variations.splice(childIndex, 1);
      } else {
        state.recordings.splice(parentIndex, 1);
      }
    },
    clearVariationBuffer: (state) => {
      state.variationBuffer = null;
      state.keptVariationsBuffer = [];
    },
  },
  extraReducers: (builder) => {
    /* HARMONIZER */
    builder.addCase(harmonizeThunk.pending, harmonizeReducers.pending);
    builder.addCase(harmonizeThunk.fulfilled, harmonizeReducers.fulfilled);
    builder.addCase(harmonizeThunk.rejected, harmonizeReducers.rejected);
  },
});

export default recordings.reducer;
export const recordingActions = {
  ...recordings.actions,
  harmonize: harmonizeThunk,
};
