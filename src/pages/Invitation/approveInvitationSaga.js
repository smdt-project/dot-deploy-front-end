import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  approveInvitationRequest,
  approveInvitationSuccess,
  approveInvitationFailure,
} from "./approveInvitationSlice";
import { setNotifier, resetNotifier } from "../../ui/notifierSlice";

function* workApproveInvitation(action) {
  const { teamId, token } = action.payload;

  try {
    const response = yield call(
      axios.post,
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/api/v1/organization/invitations/${token}/${teamId}`,
      {},
      { withCredentials: true }
    );

    yield put(approveInvitationSuccess());
    yield put(setNotifier({ success: "Invitation approved successfully!" }));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(approveInvitationFailure(message));
    yield put(setNotifier({ error: "Failed to approve invitation" }));
  } finally {
    yield put(resetNotifier());
  }
}

export function* watchApproveInvitation() {
  yield takeLatest(approveInvitationRequest.type, workApproveInvitation);
}

export default function* approveInvitationSaga() {
  yield watchApproveInvitation();
}
