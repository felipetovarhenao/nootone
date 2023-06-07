import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./inputSlice";
import userReducer from "./userSlice";
import recordingsSlice from "./recordings/recordingsSlice";
import micSlice from "./micSlice";

const store = configureStore({
  reducer: {
    input: inputReducer,
    user: userReducer,
    recordings: recordingsSlice,
    mic: micSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
