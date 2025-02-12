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
  deleteTeamSuccess,
  deleteTeamFailure,
  deleteTeamRequest,
  updateTeamRequest,
  updateTeamFailure,
  updateTeamSuccess,
} from "./organizationsSlice";

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/organization`;

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
    const response = yield call(axios.post, API_URL, action.payload, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(createTeamSuccess(response.data));
    yield put(setNotifier({ success: "Team created successfully!" }));
    yield put(fetchTeamsRequest());
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(createTeamFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

// Delete team saga
 function* deleteTeamSaga(action) {
  const token = getUserData(true);
  try{
    yield put(resetNotifier());
    yield put(setNotifier({ loading: "Deleting team..." }));
    yield call(axios.delete, `${API_URL}/${action.payload}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(fetchTeamsRequest());
    yield put(deleteTeamSuccess(action.payload));
    yield put(setNotifier({ success: "Team deleted successfully!" }));
  } catch(error){
    const message = error.response?.data?.message || error.message;
    yield put(deleteTeamFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

// Update team saga
function* updateTeamSaga(action) {
  const token = getUserData(true);
  try {
    yield put(resetNotifier());
    const response = yield call(axios.put, `${API_URL}/${action.payload.id}`, action.payload, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(updateTeamSuccess(response.data));
    yield put(setNotifier({ success: "Team updated successfully!" }));
    yield put(fetchTeamsRequest());
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(updateTeamFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

export function* watchOrganizationsSaga() {
  yield takeLatest(fetchTeamsRequest.type, fetchTeamsSaga);
  yield takeLatest(createTeamRequest.type, createTeamSaga);
  yield takeLatest(deleteTeamRequest.type, deleteTeamSaga)
  yield takeLatest(updateTeamRequest.type, updateTeamSaga);
}

