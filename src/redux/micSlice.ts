import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  isRecording: boolean;
  tempo: number;
};

const initialState: InitialState = {
  isRecording: false,
  tempo: 90,
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
    },
  },
});

export default mic.reducer;
export const { toggle, setTempo } = mic.actions;
