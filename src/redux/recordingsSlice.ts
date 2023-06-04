import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set } from "idb-keyval";

type Recording = {
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

const recordings = createSlice({
  name: "recordings",
  initialState: initialState,
  reducers: {
    push: (state, action: PayloadAction<Recording>) => {
      state.unsaved.unshift(action.payload);
    },
    // write: (state, action: PayloadAction<number>) => {
    //   const index = action.payload;
    //   const recording = state.unsaved[index];
    //   set(recording.url, get)
    //   state.saved.push(recording);
    //   state.unsaved.splice(index, 1);
    // },
  },
});

export default recordings.reducer;
export const { push } = recordings.actions;
