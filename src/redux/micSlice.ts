import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import CacheAPI from "../utils/CacheAPI";

type InitialState = {
  isRecording: boolean;
  isPreprocessing: boolean;
  tempo: number;
  numCountBeats: number;
  referencePitch: number;
};

const initialState: InitialState = {
  isRecording: false,
  isPreprocessing: false,
  tempo: CacheAPI.getLocalItem("tempo") || 90,
  numCountBeats: CacheAPI.getLocalItem("numCountBeats") || 4,
  referencePitch: CacheAPI.getLocalItem("referencePitch") || 69,
};

const mic = createSlice({
  name: "mic",
  initialState: initialState,
  reducers: {
    toggle: (state) => {
      state.isRecording = !state.isRecording;
    },
    setTempo: (state, action: PayloadAction<number>) => {
      state.tempo = action.payload;
      CacheAPI.setLocalItem<number>("tempo", state.tempo);
    },
    togglePreprocessing: (state) => {
      state.isPreprocessing = !state.isPreprocessing;
    },
    setNumCountBeats: (state, action: PayloadAction<number>) => {
      state.numCountBeats = action.payload;
      CacheAPI.setLocalItem<number>("numCountBeats", state.numCountBeats);
    },
    setReferencePitch: (state, action: PayloadAction<number>) => {
      state.referencePitch = (action.payload % 12) + 60;
      CacheAPI.setLocalItem<number>("referencePitch", state.referencePitch);
    },
  },
});

export default mic.reducer;
export const micActions = mic.actions;
