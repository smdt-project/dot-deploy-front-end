import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { useLocation } from "react-router-dom";

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  isPasswordReset: false,
};

// Slice
const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    resetPasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.isPasswordReset = false;
    },
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
      state.isPasswordReset = true;
    },
    resetPasswordFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
