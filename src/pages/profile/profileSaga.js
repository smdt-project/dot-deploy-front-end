import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { getUserData } from "../../features/auth/authData";
import { resetNotifier, setNotifier } from "../../ui/notifierSlice";
import {
  deleteItemRequest,
  deleteItemSuccess,
  userProfileRequest,
  userProfileSuccess,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailure,
} from "./profileSlice";

function* workUpdateProfile(action) {
  try {
    const response = yield call(
      axios.patch,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/projects/${
        action.payload._id
      }`,
      action.payload,
      {
        withCredentials: true,
      }
    );
    yield put(setNotifier({ success: "Your change is saved successfully!" }));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(setNotifier({ error: message }));
  }
}

export function* watchUpdateProfile() {
  yield takeLatest("", workUpdateProfile);
}

function* workItemDeleteSaga(action) {
  const token = getUserData(true);
  const { itemName, id } = action.payload;
  let url = `${
    import.meta.env.VITE_REACT_APP_API_URL
  }/api/v1/${itemName}s/${id}`;

  try {
    yield put(resetNotifier());
    yield put(setNotifier({ loading: `Deleting ${itemName} ...` }));
    const response = yield call(axios.delete, url, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });

    yield put(deleteItemSuccess());
    yield put(resetNotifier());
    yield put(setNotifier({ success: response.data.message }));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(setNotifier({ error: message }));
  }
}

export function* watchItemDeleteSaga() {
  yield takeLatest(deleteItemRequest.type, workItemDeleteSaga);
}

function* userProfileSagas(action) {
  try {
    const response = yield call(
      axios.get,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/users/${
        action.payload
      }`,
      { withCredentials: true }
    );
    yield put(userProfileSuccess(response.data.data.doc));
  } catch (error) {
    yield put(resetNotifier());
    yield put(setNotifier({ error: "Unable to fetch user data" }));
  }
}

function* watchProfileSaga() {
  yield takeLatest(userProfileRequest.type, userProfileSagas);
}

function* workUpdatePassword(action) {
  try {
    yield call(
      axios.patch,
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/users/updatePassword`,
      action.payload,
      { withCredentials: true }
    );

    yield put(updatePasswordSuccess());
    yield put(setNotifier({ success: "Password updated successfully!" }));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    yield put(updatePasswordFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

export function* watchUpdatePassword() {
  yield takeLatest(updatePasswordRequest.type, workUpdatePassword);
}

export default function* profileSagas() {
  yield takeLatest(userProfileRequest.type, userProfileSagas);
  yield takeLatest(deleteItemRequest.type, workItemDeleteSaga);
  yield takeLatest(updatePasswordRequest.type, workUpdatePassword);
}
