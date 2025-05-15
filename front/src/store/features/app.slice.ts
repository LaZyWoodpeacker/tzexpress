import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/user.api";

interface AppState {
  token?: string;
  login?: string;
}

const initialState: AppState = {
  token: window.localStorage.getItem("token") || undefined,
  login: undefined,
};

export const counterSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    logout: (state) => {
      state.login = undefined;
      state.token = undefined;
      window.localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.registerUser.matchFulfilled,
      (state, { payload }) => {
        state.login = payload.login;
        state.token = payload.token;
        window.localStorage.setItem("token", payload.token || "");
      }
    );
    builder.addMatcher(
      userApi.endpoints.check.matchFulfilled,
      (state, { payload }) => {
        if (!payload?.error) {
          state.login = payload.login;
        }
      }
    );
    builder.addMatcher(
      userApi.endpoints.auth.matchFulfilled,
      (state, { payload }) => {
        if (!payload?.error) {
          state.login = payload.login;
          window.localStorage.setItem("token", payload.token || "");
        }
      }
    );
  },
});

export const { logout } = counterSlice.actions;

export default counterSlice.reducer;
