import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currTab: "overview",
  // isLoading: false,
  // error: null,
  teamData: null,
  // profileChanged: false,
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    changeCurrTab: (state, action) => {
      state.currTab = action.payload;
    },
  },
});

export const { changeCurrTab } = teamsSlice.actions;

export default teamsSlice.reducer;
