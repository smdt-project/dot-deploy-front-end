import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { getUserData } from "../../features/auth/authData";
import { resetNotifier, setNotifier } from "../../ui/notifierSlice";
import {
  fetchTeamsRequest,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamRequest,
  createTeamSuccess,
  createTeamFailure,
} from "./createTeamSlice";

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/organization`;

// Fetch teams saga
function* fetchTeamsSaga() {
  const token = getUserData(true);
  try {
    yield put(resetNotifier());
    const response = yield call(axios.get, API_URL, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });

    yield put(fetchTeamsSuccess(response.data.data.organizations));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(fetchTeamsFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

// Create team saga
function* createTeamSaga(action) {
  const token = getUserData(true);
  try {
    yield put(resetNotifier());
    yield put(setNotifier({ loading: "Creating team..." }));
    const response = yield call(axios.post, API_URL, action.payload, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(createTeamSuccess(response.data));
    yield put(setNotifier({ success: "Team created successfully!" }));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(createTeamFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

export function* watchCreateTeamsSaga() {
  yield takeLatest(fetchTeamsRequest.type, fetchTeamsSaga);
  yield takeLatest(createTeamRequest.type, createTeamSaga);
}

export default function* teamsSagas() {
  yield takeLatest(fetchTeamsRequest.type, fetchTeamsSaga);
  yield takeLatest(createTeamRequest.type, createTeamSaga);
}
