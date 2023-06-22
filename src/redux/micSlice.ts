import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const getTempoCache = () => {
  const cache = localStorage.getItem("tempo");
  if (!cache) {
    return;
  }
  const bpm = parseInt(cache);
  return bpm;
};

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
  tempo: getTempoCache() || 90,
  numCountBeats: 4,
  referencePitch: 69,
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
      localStorage.setItem("tempo", String(state.tempo));
    },
    togglePreprocessing: (state) => {
      state.isPreprocessing = !state.isPreprocessing;
    },
    setNumCountBeats: (state, action: PayloadAction<number>) => {
      state.numCountBeats = action.payload;
    },
    setReferencePitch: (state, action: PayloadAction<number>) => {
      state.referencePitch = (action.payload % 12) + 60;
    },
  },
});

export default mic.reducer;
export const micActions = mic.actions;
