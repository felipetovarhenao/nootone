import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  buffer: Float32Array;
};

const initialState: InitialState = {
  buffer: new Float32Array(),
};

const input = createSlice({
  name: "input",
  initialState: initialState,
  reducers: {
    setBuffer: (state, action: PayloadAction<Float32Array>) => {
      state.buffer = action.payload;
    },
  },
});

export default input.reducer;
