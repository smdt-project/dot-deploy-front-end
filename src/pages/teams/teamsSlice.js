import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currTab: "overview",
  isLoading: false,
  error: null,
  teamData: null,
  members: [],
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    changeCurrTab: (state, action) => {
      state.currTab = action.payload;
    },
    inviteMemberRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    inviteMemberSuccess: (state, action) => {
      state.isLoading = false;
      state.members = [...state.members, action.payload];
    },
    inviteMemberFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setTeamData: (state, action) => {
      state.teamData = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export const {
  changeCurrTab,
  inviteMemberRequest,
  inviteMemberSuccess,
  inviteMemberFailure,
  setTeamData,
  setMembers,
} = teamsSlice.actions;

export default teamsSlice.reducer;
