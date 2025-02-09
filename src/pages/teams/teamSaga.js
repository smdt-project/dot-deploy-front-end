import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  inviteMemberRequest,
  inviteMemberSuccess,
  inviteMemberFailure,
} from "./teamsSlice";
import { resetNotifier, setNotifier } from "../../ui/notifierSlice";

function* workInviteMemberSaga(action) {
  const { email, teamId } = action.payload;

  try {
    yield put(resetNotifier());
    yield put(setNotifier({ loading: "Sending invitation..." }));

    const response = yield call(
      axios.post,
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/api/v1/organization/${teamId}/invitations/`,
      { email },
      {
        withCredentials: true,
      }
    );

    yield put(inviteMemberSuccess(response.data.data.invitedMember));
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
    yield put(setNotifier({ error: message }));
  }
}

export function* watchInviteMemberSaga() {
  yield takeLatest(inviteMemberRequest.type, workInviteMemberSaga);
}

export default watchInviteMemberSaga;
