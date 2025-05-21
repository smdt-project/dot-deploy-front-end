import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
} from "./chatSlice";
import { getUserData } from "../../../../features/auth/authData";
import { setNotifier } from "../../../../ui/notifierSlice";

function* workSendMessage(action) {
  const token = getUserData(true);

  try {
    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_REACT_APP_API_URL}api/v1/projects/chat`,
      {
        selectedModel: action.payload.selectedModel,
        language: action.payload.language,
        code: action.payload.code,
        question: action.payload.question,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      yield put(sendMessageSuccess({ data: response.data.data }));
    } else {
      yield put(sendMessageFailure(response.data.message));
      yield put(
        setNotifier({
          error: "Failed to request the Model. Please try again later",
        })
      );
    }
  } catch (error) {
    const message = error.response
      ? error.response.data
        ? error.response.data.message
        : error.message
      : error.message;
    yield put(sendMessageFailure(message));
    yield put(setNotifier({ error: message }));
  }
}

function* watchSendMessageSaga() {
  yield takeLatest(sendMessageRequest.type, workSendMessage);
}

export default watchSendMessageSaga;
