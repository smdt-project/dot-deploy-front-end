import { createSlice } from "@reduxjs/toolkit";
import { storeUserData } from "../authData";

const initialState = {
	isLoading: false,
	error: null,
	isUserSignedUp: false,
};

const signUpSlice = createSlice({
	name: "signup",
	initialState,
	reducers: {
		signUpRequest: (state) => {
			state.isUserSignedUp = false;
			state.error = null;
			state.isLoading = true;
		},
		signUpSuccess: (state, action) => {
			storeUserData(action.payload);
			state.isLoading = false;
			state.isUserSignedUp = true;
		},
		signUpFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

export const { signUpRequest, signUpSuccess, signUpFailure } =
	signUpSlice.actions;

export default signUpSlice.reducer;
