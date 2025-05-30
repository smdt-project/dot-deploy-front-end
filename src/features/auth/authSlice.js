import { createSlice } from "@reduxjs/toolkit";
import { removeUserData } from "./authData";

const initialState = {
  isUserSignedIn: false,
  user: null,
  userData: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStatus: (state, action) => {
      state.isUserSignedIn = action.payload.isUserSignedIn;
      console.log("authStatus", action.payload);
      state.user = action.payload.userData;
    },
    logOutRequest: (state) => {
      state.error = "";
    },
    logOutSuccess: () => {
      removeUserData();
    },
    logOutFailure: (state, action) => {
      state.error = action.payload;
    },
    userDataRequest: (state) => {
      state.isLoading = true;
      state.error = "";
    },
    userDataSuccess: (state, action) => {
      state.isLoading = false;
      console.log("userDataSuccess", action.payload);
      state.userData = action.payload;
      state.user = action.payload;
      state.user.userId = action.payload._id;
    },
    userDataFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  authStatus,
  logOutFailure,
  logOutSuccess,
  logOutRequest,
  userDataRequest,
  userDataFailure,
  userDataSuccess,
} = authSlice.actions;

export default authSlice.reducer;
