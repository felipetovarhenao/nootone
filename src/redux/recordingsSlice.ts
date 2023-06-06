import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set, setMany, entries, delMany, del } from "idb-keyval";
import audioArrayFromURL from "../utils/audioArrayFromURL";
import audioToNoteEvents from "../utils/audioToNoteEvents";

type RecordingMetadata = {
  name: string;
  date: string;
  features?: any;
};

export type Recording = RecordingMetadata & {
  url: string;
};

type CachedRecording = {
  blob: Blob;
  metadata: RecordingMetadata;
};

type InitialState = {
  saved: Recording[];
  unsaved: Recording[];
};

const initialState: InitialState = {
  saved: [],
  unsaved: [],
};

export const write = createAsyncThunk("recordings/write", async (recording: Recording): Promise<Recording | string> => {
  const { url, ...metadata } = recording;
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise<Recording | string>((resolve, reject) => {
    set(url, { blob: blob, metadata: metadata })
      .then(() => resolve(recording))
      .catch(reject);
  });
});

export const retrieveCache = createAsyncThunk("recordings/retrieveCache", async () => {
  return entries().then((entries) => {
    const recs: Recording[] = [];
    if (entries.length === 0) {
      return recs;
    }
    const updatedEntries: [string, CachedRecording][] = [];
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      URL.revokeObjectURL(key as string);
      const url = URL.createObjectURL(value.blob);
      recs.push({
        url: url,
        ...value.metadata,
      });
      updatedEntries.push([
        url,
        {
          blob: value.blob as Blob,
          metadata: { ...value.metadata },
        },
      ]);
    }
    delMany(entries.map((e) => e[0]));
    setMany(updatedEntries);
    return recs;
  });
});

export const harmonizeRecording = createAsyncThunk("recordings/harmonizeRecording", async (recording: Recording): Promise<any | void> => {
  try {
    const { array } = await audioArrayFromURL(recording.url);
    return audioToNoteEvents(array);
  } catch (error) {
    return error;
  }
});

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
      for (let i = 0; i < state.unsaved.length; i++) {
        if (state.unsaved[i].url === rec.url) {
          state.unsaved.splice(i, 1);
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
    builder.addCase(harmonizeRecording.fulfilled, (_, action) => {
      console.log("harmonization ready");
      console.log(action.payload);
    });
  },
});

export default recordings.reducer;
export const { push, discard, erase } = recordings.actions;
