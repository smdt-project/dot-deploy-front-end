import axios from "axios";
import { call, put, takeLatest, select } from "redux-saga/effects";
import { getUserData } from "../../features/auth/authData";
import { setNotifier } from "../../ui/notifierSlice";
import { setSavedProject } from "./features/editorheader/saveSlice";
import {
  runSnippetRequest,
  runSnippetSuccess,
  updateProjectFailure,
  updateProjectRequest,
  updateProjectSuccess
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
          Authorization: `Bearer ${token}`
        }
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
        topProjects: updatedTopProjects
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

function* workSnippetRun(action) {
  try {
    yield put(setNotifier({ loading: `Running Code ...` }));
    const { code, lng_id, stdin } = action.payload;

    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false&fields=*";

    // creating submission
    const submissionResponse = yield call(
      axios.post,
      url,
      {
        source_code: code,
        language_id: lng_id,
        stdin
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY
        }
      }
    );

    // extract token returned from teh submission creation
    const token = submissionResponse.data.token;

    // get submission
    let result;
    let attempts = 0;
    const maxAttempts = 10;
    const subUrl = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`;

    while (attempts < maxAttempts) {
      const statusResponse = yield call(axios.get, subUrl, {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY
        }
      });

      if (statusResponse.data.status.id > 2) {
        result = statusResponse.data;
        break;
      }

      yield new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result) {
      throw new Error("Code execution timed out");
    }

    // Handle the result
    const stdout = result.stdout;
    const stderr =
      result.status_id === 6 ? result.compile_output : result.stderr;
    const status = result.status.description;
    const message = result.message;

    console.log("result", result);
    console.log({
      stdout,
      stderr,
      status,
      message
    });

    yield put(
      runSnippetSuccess({
        stdout,
        stderr,
        status,
        message
      })
    );

    if (stderr) {
      yield put(
        setNotifier({
          error: `${status}: Check on console!`
        })
      );
    } else {
      yield put(setNotifier({ success: "Code executed successfully!" }));
    }
  } catch (error) {
    const message = error.response
      ? error.response.data
        ? error.response.data.message
        : error.message
      : error.message;
    yield put(runSnippetSuccess({ error: message, output: "" }));
    console.log({ error });
    yield put(setNotifier({ error: message }));
  }
}

export function* watchSnippetRunSaga() {
  yield takeLatest(runSnippetRequest.type, workSnippetRun);
}

export default watchProjectUpdateSaga;
