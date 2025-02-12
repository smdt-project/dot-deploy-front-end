import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isApproved: false,
  error: null,
};

const approveInvitationSlice = createSlice({
  name: "approveInvitation",
  initialState,
  reducers: {
    approveInvitationRequest: (state, action) => {
      state.isLoading = true;
      state.isApproved = false;
      state.error = null;
    },
    approveInvitationSuccess: (state) => {
      state.isLoading = false;
      state.isApproved = true;
      state.error = null;
    },
    approveInvitationFailure: (state, action) => {
      state.isLoading = false;
      state.isApproved = false;
      state.error = action.payload;
    },
    resetInvitationState: (state) => {
      state.isLoading = false;
      state.isApproved = false;
      state.error = null;
    },
  },
});

export const {
  approveInvitationRequest,
  approveInvitationSuccess,
  approveInvitationFailure,
  resetInvitationState,
} = approveInvitationSlice.actions;

export default approveInvitationSlice.reducer;
