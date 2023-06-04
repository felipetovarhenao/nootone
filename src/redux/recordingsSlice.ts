import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set, setMany, entries, delMany } from "idb-keyval";

export type Recording = {
  name: string;
  url: string;
};

type InitialState = {
  saved: Recording[];
  unsaved: Recording[];
};

const initialState: InitialState = {
  saved: [],
  unsaved: [],
};

const writeRecording = async (recording: Recording): Promise<Recording | string> => {
  const { url } = recording;
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise<Recording | string>((resolve, reject) => {
    set(recording.url, blob)
      .then(() => resolve(recording))
      .catch(reject);
  });
};

export const write = createAsyncThunk("recordings/write", writeRecording);

const retrieveCache = async () => {
  return entries().then(async (entries) => {
    const recs: Recording[] = [];
    const updatedEntries: [string, Blob][] = [];
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      URL.revokeObjectURL(key as string);
      recs.push({
        url: URL.createObjectURL(value),
        name: `${i}`,
      });
      updatedEntries.push([key as string, value]);
    }
    delMany(entries.map((e) => e[0]));
    setMany(updatedEntries);
    return recs;
  });
};

export const pushFromCache = createAsyncThunk("recordings/pushFroCache", retrieveCache);

const recordings = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    push: (state, action: PayloadAction<Recording>) => {
      let exists = false;
      for (let i = 0; i < state.unsaved.length; i++) {
        if (state.unsaved[i].url === action.payload.url) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        state.unsaved.unshift(action.payload);
      }
    },
    discard: (state, action: PayloadAction<Recording>) => {
      for (let i = 0; i < state.unsaved.length; i++) {
        if (state.unsaved[i].url === action.payload.url) {
          state.unsaved.splice(i, 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(write.fulfilled, (state, action: PayloadAction<Recording | string>) => {
      const rec = action.payload as Recording;
      state.saved.push(rec);
      for (let i = 0; i < state.unsaved.length; i++) {
        if (state.unsaved[i].url === rec.url) {
          state.unsaved.splice(i, 1);
          break;
        }
      }
    });
    builder.addCase(write.rejected, (_, action) => {
      console.log("Error writing file", action.payload);
    });
    builder.addCase(pushFromCache.fulfilled, (state, action: PayloadAction<Recording[]>) => {
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
          state.saved.push(rec);
        }
      }
    });
  },
});

export default recordings.reducer;
export const { push, discard } = recordings.actions;
