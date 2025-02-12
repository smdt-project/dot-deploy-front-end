import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  loading: false,
  error: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    fetchTeamsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeamsSuccess: (state, action) => {
      state.teams = action.payload;
      state.loading = false;
    },
    fetchTeamsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTeamRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTeamSuccess: (state) => {
      state.loading = false;
    },
    createTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTeamRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTeamSuccess: (state, action) => {
      const index = state.teams.findIndex(
        (team) => team.id === action.payload.id
      );
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
      state.loading = false;
    },
    updateTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTeamRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTeamSuccess: (state, action) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      state.loading = false;
    },
    deleteTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTeamsRequest,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamRequest,
  createTeamSuccess,
  createTeamFailure,
  updateTeamRequest,
  updateTeamSuccess,
  updateTeamFailure,
  deleteTeamRequest,
  deleteTeamSuccess,
  deleteTeamFailure,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
