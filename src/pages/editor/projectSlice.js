import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: {
    name: "",
    code: [],
    type: "ui",
    lngName: "html",
  },
  currLng: "html",
  currCode: "",
  selectedVersion: 0,
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
      state.project = action.payload.project;
      state.selectedVersion = action.payload.project.code.length - 1;
    },
    updateSnippetCode: (state, action) => {
      const { html, css, js } = action.payload;
      const versionIndex = state.selectedVersion;
      if (state.project.code[versionIndex]) {
        state.project.code[versionIndex] = {
          ...state.project.code[versionIndex],
          html: html || state.project.code[versionIndex].html,
          css: css || state.project.code[versionIndex].css,
          js: js || state.project.code[versionIndex].js,
        };
      }
    },
    updateHTML: (state, action) => {
      const versionIndex = state.selectedVersion;
      if (state.project.code[versionIndex]) {
        state.project.code[versionIndex].html = action.payload;
      }
    },
    updateCSS: (state, action) => {
      const versionIndex = state.selectedVersion;
      if (state.project.code[versionIndex]) {
        state.project.code[versionIndex].css = action.payload;
      }
    },
    updateJS: (state, action) => {
      const versionIndex = state.selectedVersion;
      if (state.project.code[versionIndex]) {
        state.project.code[versionIndex].js = action.payload;
      }
    },
    updateSelectedLng: (state, action) => {
      console.log("smex", action.payload.code, state.selectedVersion);
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
      state.selectedVersion = initialState.selectedVersion;
    },
    setSelectedVersion: (state, action) => {
      console.log(action.payload);
      state.selectedVersion = action.payload;
    },
    updateProjectRequest: (state) => {
      state.isDone = false;
      state.error = "";
      state.isLoading = true;
    },
    updateProjectSuccess: (state) => {
      state.isLoading = false;
      state.isDone = true;
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
  updateSelectedLng,
  resetCurrProject,
  setSelectedVersion,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailure,
} = projectSlice.actions;

export default projectSlice.reducer;
