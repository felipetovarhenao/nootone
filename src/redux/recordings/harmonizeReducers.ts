import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { InitialState } from "./recordingsSlice";
import { HarmonizerReturnType } from "./harmonizeTypes";

/* HARMONIZER */
const pending = (state: Draft<InitialState>) => {
  state.isProcessing = true;
  state.variationBuffer = null;
};

const fulfilled = (state: Draft<InitialState>, action: PayloadAction<HarmonizerReturnType | void>) => {
  state.isProcessing = false;
  if (action.payload) {
    if (state.selectedRecordingIndex !== null) {
      const existingTitles = state.recordings[state.selectedRecordingIndex].variations.map((x) => x.name);
      let currentTitle = action.payload.variation.name;
      let v = 1;

      while (true) {
        if (!existingTitles.includes(`${currentTitle} v${v}`)) {
          break;
        }
        v++;
      }
      action.payload.variation.name = `${currentTitle} v${v}`;
      state.recordings[state.selectedRecordingIndex].features = {
        ...state.recordings[state.selectedRecordingIndex].features,
        ...action.payload.features,
      };
      state.variationBuffer = action.payload.variation;
    }
  }
};

const rejected = (state: Draft<InitialState>) => {
  state.isProcessing = false;
  state.variationBuffer = null;
};

const harmonizeReducers = {
  pending,
  fulfilled,
  rejected,
};

export default harmonizeReducers;
