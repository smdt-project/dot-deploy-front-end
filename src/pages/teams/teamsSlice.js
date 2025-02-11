import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currTab: "overview",
  isLoading: false,
  isLoadingProjects: false,
  isApprovingInvitation: false,
  error: null,
  teamData: null,
  members: [],
  projects: [],
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
    },
    inviteMemberFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    approveInvitations: (state) => {
      state.isApprovingInvitation = true;
      state.error = null;
    },
    setTeamData: (state, action) => {
      state.teamData = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    fetchProjectsRequest: (state) => {
      state.isLoadingProjects = true;
      state.error = null;
    },
    fetchProjectFailure: (state, action) => {
      state.isLoadingProjects = false;
      state.error = action.payload;
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
  setProjects,
  fetchProjectsRequest,
  fetchProjectFailure,
} = teamsSlice.actions;

export default teamsSlice.reducer;
