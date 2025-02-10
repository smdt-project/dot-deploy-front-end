import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: {
    name: "",
    code: [
      {
        html: "",
        css: "",
        js: "",
        // , version: 1
      },
    ],
    type: "ui",
    lngName: "html",
  },
  currLng: "html",
  versions: [],
  latestCode: {},
  selectedVersion: 1,
  currCode: "",
  isLoading: false,
  error: false,
  isNew: true,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrProject: (state, action) => {
      state.isNew = action.payload.isNew;
      state.project = {
        ...action.payload.project,
        code: action.payload.project.code || initialState.project.code,
      };
      state.latestCode =
        action.payload.project.code[0] || initialState.project.code[0];
      state.selectedVersion = state.project.code[0]?.version;
      state.versions = action.payload.project.code;
    },
    selectVersion: (state, action) => {
      const selectedVersion = action.payload;
      state.selectedVersion = selectedVersion.version;
      state.project.code = [selectedVersion];
      state.latestCode = selectedVersion;
    },
    updateSnippetCode: (state, action) => {
      state.project = {
        ...state.project,
        code: action.payload,
      };
    },
    updateHTML: (state, action) => {
      state.latestCode = {
        ...state.latestCode,
        html: action.payload,
      };
    },
    updateCSS: (state, action) => {
      state.latestCode = {
        ...state.latestCode,
        css: action.payload,
      };
    },
    updateJS: (state, action) => {
      state.latestCode = {
        ...state.latestCode,
        js: action.payload,
      };
    },
    setLatestCode: (state, action) => {
      state.project.latestCode = action.payload;
    },
    updateSelectedLng: (state, action) => {
      state.currCode = action.payload.code;
      state.currLng = action.payload.lng;
    },
    resetCurrProject: (state) => {
      state.currCode = initialState.currCode;
      state.currLng = initialState.currLng;
      state.project = initialState.project;
      state.isNew = initialState.isNew;
      state.error = initialState.error;
      state.isLoading = initialState.isLoading;
    },
    updateProjectRequest: (state) => {
      state.isDone = false;
      state.error = "";
      state.isLoading = true;
    },
    updateProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.isDone = true;
      state.project = action.payload;
      state.latestCode = action.payload.code[0];
      state.versions = action.payload.code;
      state.selectedVersion = action.payload.code[0].version;
    },
    updateProjectFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCurrProject,
  updateSnippetCode,
  updateCSS,
  updateHTML,
  updateJS,
  selectVersion,
  updateSelectedLng,
  setLatestCode,
  resetCurrProject,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailure,
} = projectSlice.actions;

export default projectSlice.reducer;
