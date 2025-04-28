// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null, // Giriş yapan kullanıcı bilgisi
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.error = null;
    },
  },
});


export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions;

export default userSlice.reducer;
