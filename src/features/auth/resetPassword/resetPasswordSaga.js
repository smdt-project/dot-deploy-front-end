import { call, put, takeLatest } from "redux-saga/effects";
import {
  resetPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
} from "./resetPasswordSlice";
import axios from "axios";

// Saga worker function
function* workResetPasswordSaga(action) {
  try {
    const { token, password, confirmPassword } = action.payload;
    yield call(
      axios.patch,
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/api/v1/users/resetpassword/${token}`,
      { password, confirmPassword },
      { withCredentials: true }
    );
    yield put(resetPasswordSuccess());
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(resetPasswordFailure(message));
  }
}

// Saga watcher function
export function* watchResetPasswordSaga() {
  yield takeLatest(resetPasswordRequest.type, workResetPasswordSaga);
}
