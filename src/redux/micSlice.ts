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
  tempo: number;
};

const initialState: InitialState = {
  isRecording: false,
  tempo: getTempoCache() || 90,
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
  },
});

export default mic.reducer;
export const { toggle, setTempo } = mic.actions;
export const micActions = mic.actions;
