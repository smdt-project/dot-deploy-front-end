import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "../features/auth/authSlice";
import signInReducer from "../features/auth/signin/signInSlice";
import signUpReducer from "../features/auth/signup/signUpSlice";
import searchReducer from "../features/search/searchSlice";
import communityReducer from "../pages/community/communitySlice";
import postReducer from "../pages/community/features/comSidebar/postSlice";
import editorReducer from "../pages/editor/editorSlice";
import saveReducer from "../pages/editor/features/editorheader/saveSlice";
import settingReducer from "../pages/editor/features/sidebar/settingSlice";
import sidebarReducer from "../pages/editor/features/sidebar/sidebarSlice";
import projectReducer from "../pages/editor/projectSlice";
import profileReducer from "../pages/profile/profileSlice";
import notifierReducer from "../ui/notifierSlice";
import teamsReducer from "../pages/teams/teamsSlice";
import resetPasswordReducer from "../features/auth/resetPassword/resetPasswordSlice";
import organizationsReducer from "../pages/profile/organizationsSlice";
import approveInvitationReducer from "../pages/Invitation/approveInvitationSlice";
import completionReducer from "../pages/editor/completionSlice";
import chatReducer from "../pages/editor/features/sidebar/chatSlice";

export const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    editor: editorReducer,
    notifier: notifierReducer,
    post: postReducer,
    profile: profileReducer,
    teams: teamsReducer,
    project: projectReducer,
    setting: settingReducer,
    sidebar: sidebarReducer,
    signUp: signUpReducer,
    signIn: signInReducer,
    save: saveReducer,
    search: searchReducer,
    resetPassword: resetPasswordReducer,
    organizations: organizationsReducer,
    approveInvitation: approveInvitationReducer,
    completion: completionReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

export default store;
