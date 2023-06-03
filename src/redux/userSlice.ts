import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserLogin = {
  username: string;
  password: string;
};

type UserRegistration = UserLogin & {
  confirmation: string;
  email: string;
};

const loginCallback = async (loginForm: UserLogin): Promise<UserLogin | string> => {
  return new Promise<UserLogin | string>((resolve, reject) => {
    setTimeout(() => {
      const isError = false;
      if (isError) {
        reject("login error!");
      } else {
        resolve(loginForm);
      }
    }, 1000);
  });
};

const registrationCallback = async (registrationForm: UserRegistration): Promise<UserRegistration | string> => {
  return new Promise<UserRegistration | string>((resolve, reject) => {
    setTimeout(() => {
      const isError = false; // Set to true to simulate an error
      if (isError) {
        reject("Dummy promise rejected!");
      } else {
        resolve(registrationForm);
      }
    }, 1000);
  });
};

const logoutCallback = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const isError = false;
      if (isError) {
        reject();
      } else {
        resolve();
      }
    }, 1000);
  });
};

export const login = createAsyncThunk("user/login", loginCallback);
export const logout = createAsyncThunk("user/logout", logoutCallback);
export const register = createAsyncThunk("user/register", registrationCallback);

type InitialState = {
  loading: boolean;
  username: string;
  plan: "free" | "pro";
  error: string;
};

const initialState: InitialState = {
  loading: false,
  username: "",
  error: "",
  plan: "free",
};

const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* LOGIN */
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.username = (action.payload as UserLogin).username as string;
      state.error = "";
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.username = "";
      state.error = action.payload as string;
    });
    /* REGISTRATION */
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.username = (action.payload as UserRegistration).username as string;
      state.error = "";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.username = "";
      state.error = action.payload as string;
    });
    /* LOGOUT */
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.username = "";
      state.error = "";
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      state.error = "Something went wrong when logging out";
    });
  },
});

export default user.reducer;
