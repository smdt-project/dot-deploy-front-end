import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ghostTextSuggestion: null,
  isGhostTextLoading: false,
  ghostTextError: null,
};

const completionSlice = createSlice({
  name: "completion",
  initialState,
  reducers: {
    fetchGhostTextRequest: (state) => {
      state.isGhostTextLoading = true;
      state.ghostTextError = null;
    },
    fetchGhostTextSuccess: (state, action) => {
      state.isGhostTextLoading = false;
      state.ghostTextSuggestion = action.payload.suggestion;
    },
    fetchGhostTextFailure: (state, action) => {
      state.isGhostTextLoading = false;
      state.ghostTextError = action.payload;
      state.ghostTextSuggestion = null;
    },
    clearGhostText: (state) => {
      state.ghostTextSuggestion = null;
      state.isGhostTextLoading = false;
    },
  },
});

export const {
  fetchGhostTextRequest,
  fetchGhostTextSuccess,
  fetchGhostTextFailure,
  clearGhostText,
} = completionSlice.actions;

export default completionSlice.reducer;
