import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchGhostTextFailure,
  fetchGhostTextRequest,
  fetchGhostTextSuccess,
} from "./completionSlice";
import { getUserData } from "../../features/auth/authData";

function cleanMarkdownSuggestion(suggestion) {
  if (!suggestion || typeof suggestion !== "string") {
    return "";
  }

  let cleaned = suggestion;

  const languages = [
    "html",
    "css",
    "javascript",
    "js",
    "python",
    "java",
    "c",
    "cpp",
    "typescript",
    "ts",
    "php",
    "ruby",
    "go",
    "rust",
    "kotlin",
    "swift",
    "sql",
    "json",
    "xml",
    "yaml",
    "yml",
    "bash",
    "shell",
    "sh",
    "react",
    "vue",
    "angular",
    "jsx",
    "tsx",
  ];

  for (const lang of languages) {
    const startPattern = new RegExp(`^\`\`\`${lang}\\s*`, "i");
    if (startPattern.test(cleaned)) {
      cleaned = cleaned.replace(startPattern, "");
      break;
    }
  }

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }

  cleaned = cleaned.replace(/^`+|`+$/g, "");

  cleaned = cleaned.trim();

  return cleaned;
}

function* workFetchGhostText(action) {
  const { language, context, selectedModel } = action.payload;
  const token = getUserData(true);
  const modelToUse = selectedModel || "Gemini 2.0 Flash";

  try {
    const response = yield call(
      axios.post,
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/api/v1/projects/auto-completion`,
      {
        selectedModel: modelToUse,
        language,
        code: context,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.message === "success" &&
      typeof response.data.data === "string"
    ) {
      const rawSuggestion = response.data.data;
      const cleanedSuggestion = cleanMarkdownSuggestion(rawSuggestion);

      yield put(fetchGhostTextSuccess({ suggestion: cleanedSuggestion }));
    } else if (response.data && response.data.data === "") {
      yield put(fetchGhostTextSuccess({ suggestion: "" }));
    } else {
      console.error(
        "Unexpected API response structure for ghost text:",
        response.data
      );
      yield put(
        fetchGhostTextFailure("Received invalid suggestion format from server")
      );
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch suggestion";
    yield put(fetchGhostTextFailure(message));
  }
}

function* watchFetchGhostTextSaga() {
  yield takeLatest(fetchGhostTextRequest.type, workFetchGhostText);
}

export default watchFetchGhostTextSaga;
