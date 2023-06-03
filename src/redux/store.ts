import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./inputSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    input: inputReducer,
    user: userReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
