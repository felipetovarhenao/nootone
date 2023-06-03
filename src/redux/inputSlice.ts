import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  buffer: number[];
};

const initialState: InitialState = {
  buffer: [],
};

const input = createSlice({
  name: "input",
  initialState: initialState,
  reducers: {
    setBuffer: (state, action: PayloadAction<number[]>) => {
      state.buffer = action.payload;
    },
  },
});

export default input.reducer;
