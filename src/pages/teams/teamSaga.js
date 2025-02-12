import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  inviteMemberRequest,
  inviteMemberFailure,
  setProjects,
  fetchProjectsRequest,
  fetchProjectFailure,
} from "./teamsSlice";
import { resetNotifier, setNotifier } from "../../ui/notifierSlice";
import { getUserData } from "../../features/auth/authData";

function* workInviteMemberSaga(action) {
  const { email, teamId } = action.payload;
  const token = getUserData(true);

  try {
    yield put(resetNotifier());
    yield put(setNotifier({ loading: "Sending invitation..." }));

    yield call(
      axios.post,
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/api/v1/organization/${teamId}/invitations/`,
      { email },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put(resetNotifier());
    yield put(setNotifier({ success: "Invitation sent successfully!" }));
  } catch (error) {
    const message = error.response
      ? error.response.data
        ? error.response.data.message
        : error.message
      : error.message;
    yield put(inviteMemberFailure(message));
    yield put(resetNotifier());
    yield put(setNotifier({ error: " Failed to send invitation " }));
  }
}

function* fetchProjectsSaga(action) {
  const token = getUserData(true);

  try {
    yield put(resetNotifier());
    const response = yield call(
      axios.get,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/organization/projects/${
        action.payload
      }`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    yield put(setProjects(response.data.data.docs));
  } catch (error) {
    const message = error.response
      ? error.response.data
        ? error.response.data.message
        : error.message
      : error.message;
    yield put(fetchProjectFailure(message));
    yield put(resetNotifier());
    yield put(setNotifier({ error: message }));
  }
}

export function* watchInviteMemberSaga() {
  yield takeLatest(inviteMemberRequest.type, workInviteMemberSaga);
  yield takeLatest(fetchProjectsRequest.type, fetchProjectsSaga);
}

export default watchInviteMemberSaga;
