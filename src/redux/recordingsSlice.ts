import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set, setMany, entries, delMany, del } from "idb-keyval";
import audioArrayFromURL from "../utils/audioArrayFromURL";
import audioToNoteEvents from "../utils/audioToNoteEvents";
// import NoteHarmonizer from "../utils/NoteHarmonizer";

type RecordingMetadata = {
  name: string;
  date: string;
  duration: number;
  tags: string[];
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
};

const initialState: InitialState = {
  saved: [],
};

const write = createAsyncThunk("recordings/write", async (recording: Recording): Promise<Recording | string> => {
  const { url, ...metadata } = recording;
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise<Recording | string>((resolve, reject) => {
    set(url, { blob: blob, metadata: metadata })
      .then(() => resolve(recording))
      .catch(reject);
  });
});

const retrieveCache = createAsyncThunk("recordings/retrieveCache", async () => {
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

const harmonize = createAsyncThunk("recordings/harmonize", async (recording: Recording): Promise<any | void> => {
  try {
    const { array } = await audioArrayFromURL(recording.url);
    const notes = await audioToNoteEvents(array);
    return notes;
    // NoteHarmonizer()
  } catch (error) {
    return error;
  }
});

const recordings = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    addNew: (state, action: PayloadAction<Omit<Recording, "tags" | "features" | "date">>) => {
      action.payload.url
      state.saved.unshift({
        tags: [],
        features: {},
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

    /* harmonizer */
    builder.addCase(harmonize.pending, () => {});
    builder.addCase(harmonize.fulfilled, () => {});
    builder.addCase(harmonize.rejected, () => {});
  },
});

export default recordings.reducer;
export const recordingActions = {
  harmonize: harmonize,
  write: write,
  retrieveCache: retrieveCache,
  ...recordings.actions,
};
