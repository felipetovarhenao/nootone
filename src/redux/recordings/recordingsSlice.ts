import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { del } from "idb-keyval";
import harmonize from "./harmonizerThunk";
import retrieveCache from "./retrieveCacheThunk";
import write from "./writeThunk";
import { Recording } from "../../types/audio";

type InitialState = {
  isProcessing: boolean;
  saved: Recording[];
};

const initialState: InitialState = {
  isProcessing: false,
  saved: [],
};

const recordings = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    addNew: (state, action: PayloadAction<Omit<Recording, "tags" | "features" | "date" | "variations">>) => {
      action.payload.url;
      state.saved.unshift({
        tags: [],
        features: {},
        variations: [],
        date: JSON.stringify(new Date()),
        ...action.payload,
      });
    },
    discard: (state, action: PayloadAction<Recording>) => {
      for (let i = 0; i < state.saved.length; i++) {
        if (state.saved[i].url === action.payload.url) {
          state.saved.splice(i, 1);
          break;
        }
      }
    },
    erase: (state, action: PayloadAction<Recording>) => {
      for (let i = 0; i < state.saved.length; i++) {
        if (state.saved[i].url === action.payload.url) {
          del(state.saved[i].url);
          state.saved.splice(i, 1);
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(write.fulfilled, (state, action: PayloadAction<Recording | string>) => {
      const rec = action.payload as Recording;
      for (let i = 0; i < state.saved.length; i++) {
        if (state.saved[i].url === rec.url) {
          state.saved.splice(i, 1);
          state.saved.push({ ...rec });
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
        for (let j = 0; j < state.saved.length; j++) {
          if (state.saved[j].url === rec.url) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          state.saved.push({ ...rec });
        }
      }
    });
    builder.addCase(retrieveCache.rejected, () => {
      console.log("no entries to load");
    });

    /* HARMONIZER */
    builder.addCase(harmonize.pending, (state) => {
      state.isProcessing = true;
    });
    builder.addCase(harmonize.fulfilled, (state, action) => {
      state.isProcessing = false;
      if (action.payload) {
        for (let i = 0; i < state.saved.length; i++) {
          if (state.saved[i].url === action.payload.url) {
            state.saved[i] = action.payload;
          }
        }
      }
    });
    builder.addCase(harmonize.rejected, (state) => {
      state.isProcessing = false;
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
