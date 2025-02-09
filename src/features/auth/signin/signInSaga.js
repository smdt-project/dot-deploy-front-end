import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  signInFailure,
  signInRequest,
  signInSuccess,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} from "./signInSlice";
import { resetNotifier, setNotifier } from "../../../ui/notifierSlice";

// Worker Saga: Handle login requests
function* workSignInSaga(action) {
  try {
    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/users/login`,
      action.payload,
      { withCredentials: true }
    );

    yield put(
      signInSuccess({
        data: response.data.data.user,
        token: response.data.token,
      })
    );
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(signInFailure(message));
  }
}

// Worker Saga: Handle forgot password requests
function* workForgotPasswordSaga(action) {
  try {
    yield put(resetNotifier());
    yield put(setNotifier({ loading: "Sending reset email..." }));

    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/users/forgotpassword`,
      action.payload
    );

    yield put(forgotPasswordSuccess(response.data.message));
    yield put(resetNotifier());
    yield put(setNotifier({ success: "Reset email sent successfully!" }));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(forgotPasswordFailure(message));
    yield put(resetNotifier());
    yield put(setNotifier({ error: message }));
  }
}

// Watcher Saga: Watches for sign-in and forgot password actions
export function* watchSignInSagas() {
  yield takeLatest(signInRequest.type, workSignInSaga);
  yield takeLatest(forgotPasswordRequest.type, workForgotPasswordSaga);
}
