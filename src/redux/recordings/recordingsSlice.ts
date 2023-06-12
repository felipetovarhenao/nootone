import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { del } from "idb-keyval";
import harmonize, { HarmonizerReturnType } from "./harmonizerThunk";
import retrieveCache from "./retrieveCacheThunk";
import write from "./writeThunk";
import { Recording, RecordingVariation } from "../../types/audio";

type InitialState = {
  isProcessing: boolean;
  selectedRecordingIndex: number | null;
  recordings: Recording[];
  variationBuffer: RecordingVariation | null;
};

const initialState: InitialState = {
  isProcessing: false,
  selectedRecordingIndex: null,
  variationBuffer: null,
  recordings: [],
};

const recordings = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    addNew: (state, action: PayloadAction<Omit<Recording, "tags" | "features" | "date" | "variations">>) => {
      action.payload.url;
      state.recordings.unshift({
        tags: [],
        features: {},
        variations: [],
        date: new Date().toLocaleString(),
        ...action.payload,
      });
    },
    discard: (state, action: PayloadAction<Recording>) => {
      for (let i = 0; i < state.recordings.length; i++) {
        if (state.recordings[i].url === action.payload.url) {
          state.recordings.splice(i, 1);
          break;
        }
      }
    },
    erase: (state, action: PayloadAction<Recording>) => {
      for (let i = 0; i < state.recordings.length; i++) {
        if (state.recordings[i].url === action.payload.url) {
          del(state.recordings[i].url);
          state.recordings.splice(i, 1);
          break;
        }
      }
    },
    selectRecording: (state, action: PayloadAction<number>) => {
      state.selectedRecordingIndex = action.payload;
    },
    keepVariation: (state) => {
      if (state.selectedRecordingIndex !== null && state.variationBuffer) {
        state.recordings[state.selectedRecordingIndex].variations.unshift(state.variationBuffer);
        state.variationBuffer = null;
      }
    },
    deleteVariation: (state, action: PayloadAction<[Recording, RecordingVariation]>) => {
      for (let i = 0; i < state.recordings.length; i++) {
        if (state.recordings[i].url !== action.payload[0].url) {
          continue;
        }
        for (let j = 0; j < state.recordings[i].variations.length; j++) {
          if (state.recordings[i].variations[j].url !== action.payload[1].url) {
            continue;
          }
          state.recordings[i].variations.splice(j, 1);
          return;
        }
        throw new Error("Recording not found");
      }
    },
    clearVariationBuffer: (state) => {
      state.variationBuffer = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(write.fulfilled, (state, action: PayloadAction<Recording | string>) => {
      const rec = action.payload as Recording;
      for (let i = 0; i < state.recordings.length; i++) {
        if (state.recordings[i].url === rec.url) {
          state.recordings.splice(i, 1);
          state.recordings.push({ ...rec });
          break;
        }
      }
    });
    builder.addCase(write.rejected, (_, action) => {
      console.log("Error writing file", action.payload);
    });
    builder.addCase(retrieveCache.fulfilled, (state, action: PayloadAction<Recording[]>) => {
      for (let i = 0; i < action.payload.length; i++) {
        const rec = action.payload[i];
        let exists = false;
        for (let j = 0; j < state.recordings.length; j++) {
          if (state.recordings[j].url === rec.url) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          state.recordings.push({ ...rec });
        }
      }
    });
    builder.addCase(retrieveCache.rejected, () => {
      console.log("no entries to load");
    });

    /* HARMONIZER */
    builder.addCase(harmonize.pending, (state) => {
      state.isProcessing = true;
      state.variationBuffer = null;
    });
    builder.addCase(harmonize.fulfilled, (state, action: PayloadAction<HarmonizerReturnType | void>) => {
      state.isProcessing = false;
      if (action.payload) {
        if (state.selectedRecordingIndex !== null) {
          state.recordings[state.selectedRecordingIndex].features.noteEvents = action.payload.noteEvents;
        }
        state.variationBuffer = action.payload.variation;
      }
    });
    builder.addCase(harmonize.rejected, (state) => {
      state.isProcessing = false;
      state.variationBuffer = null;
    });
  },
});

export default recordings.reducer;
export const recordingActions = {
  harmonize: harmonize,
  write: write,
  retrieveCache: retrieveCache,
  ...recordings.actions,
};
