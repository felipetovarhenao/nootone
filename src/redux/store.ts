import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import recordingsSlice from "./recordings/recordingsSlice";
import micSlice from "./mic/micSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    recordings: recordingsSlice,
    mic: micSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
