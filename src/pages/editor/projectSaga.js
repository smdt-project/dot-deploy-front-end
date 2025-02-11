import axios from "axios";
import { call, put, takeLatest, select } from "redux-saga/effects";
import { getUserData } from "../../features/auth/authData";
import { setNotifier } from "../../ui/notifierSlice";
import { setSavedProject } from "./features/editorheader/saveSlice";
import {
  updateProjectFailure,
  updateProjectRequest,
  updateProjectSuccess,
} from "./projectSlice";
import { userDataSuccess } from "../../features/auth/authSlice";
import { getDataSuccess } from "../community/communitySlice";

function* workProjectUpdate(action) {
  const token = getUserData(true);
  const userData = yield select((state) => state.auth.userData);
  const latests = yield select((state) => state.community.latests);
  const notifications = yield select((state) => state.community.notifications);
  const topProjects = yield select((state) => state.community.topProjects);
  try {
    const response = yield call(
      axios.patch,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/projects/${
        action.payload._id
      }`,
      action.payload,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    yield put(updateProjectSuccess(response.data.updatedDoc));
    yield put(setSavedProject(response.data.updatedDoc));

    const updatedProject = response.data.updatedDoc;
    const updatedProjects = userData.projects.map((project) =>
      project._id === updatedProject._id ? updatedProject : project
    );
    const updatedLatests = latests.map((project) =>
      project._id === updatedProject._id ? updatedProject : project
    );
    const updatedTopProjects = topProjects.map((project) =>
      project._id === updatedProject._id ? updatedProject : project
    );

    yield put(
      getDataSuccess({
        notifications,
        latest: updatedLatests,
        topProjects: updatedTopProjects,
      })
    );
    yield put(userDataSuccess({ ...userData, projects: updatedProjects }));
    yield put(setNotifier({ success: "Your change is saved successfully!" }));
  } catch (error) {
    const message = error.response
      ? error.response.data
        ? error.response.data.message
        : error.message
      : error.message;
    yield put(updateProjectFailure(message));
    yield put(setNotifier({ error: error.message }));
  }
}

function* watchProjectUpdateSaga() {
  yield takeLatest(updateProjectRequest.type, workProjectUpdate);
}

export default watchProjectUpdateSaga;
