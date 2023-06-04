import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./inputSlice";
import userReducer from "./userSlice";
import recordingsSlice from "./recordingsSlice";

const store = configureStore({
  reducer: {
    input: inputReducer,
    user: userReducer,
    recordings: recordingsSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
