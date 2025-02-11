import { createSlice } from "@reduxjs/toolkit";
import { storeUserData } from "../authData";

const initialState = {
  isLoading: false,
  error: null,
  isUserLoggedIn: false,
  forgotPasswordStatus: null,
};

const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    signInRequest: (state) => {
      state.isUserLoggedIn = false;
      state.isLoading = true;
      state.error = "";
    },
    signInSuccess: (state, action) => {
      storeUserData(action.payload);
      state.isLoading = false;
      state.isUserLoggedIn = true;
    },
    signInFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Forgot Password Actions
    forgotPasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.forgotPasswordStatus = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.isLoading = false;
      state.forgotPasswordStatus = action.payload;
    },
    forgotPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInRequest,
  signInSuccess,
  signInFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} = signInSlice.actions;

export default signInSlice.reducer;
