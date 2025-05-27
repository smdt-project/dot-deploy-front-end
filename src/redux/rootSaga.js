import { all, fork } from "redux-saga/effects";
import {
  watchLogoutSagas,
  watchUserDataSagas,
} from "../features/auth/authSaga";
import { watchSignInSagas } from "../features/auth/signin/signInSaga";
import { watchSignUpSagas } from "../features/auth/signup/signUpSaga";
import watchCommDataSagas, {
  watchCommentSagas,
  watchDetailingSagas,
  watchLikeSagas,
} from "../pages/community/communitySaga";
import watchPostCreateSagas, {
  watchPostDeleteSagas,
  watchPostUpdateSagas,
} from "../pages/community/features/comSidebar/postSaga";
import watchSaveSagas from "../pages/editor/features/editorheader/saveSaga";
import watchProjectUpdateSaga, {
  watchSnippetRunSaga
} from "../pages/editor/projectSaga";
import watchProfileSaga, {
  watchItemDeleteSaga
} from "../pages/profile/profileSaga";
import { watchSearchSaga } from "../features/search/searchSaga";
import watchSendMessageSaga from "../pages/editor/features/sidebar/chatSaga";
import watchInviteMemberSaga from "../pages/teams/teamSaga";
import { watchResetPasswordSaga } from "../features/auth/resetPassword/resetPasswordSaga";
import { watchOrganizationsSaga } from "../pages/profile/organizationsSaga";
import { watchApproveInvitation } from "../pages/Invitation/approveInvitationSaga";

import watchFetchGhostTextSaga from "../pages/editor/completionSaga";

function* rootSaga() {
  yield all([
    fork(watchSendMessageSaga),
    fork(watchSignUpSagas),
    fork(watchSignInSagas),
    fork(watchLogoutSagas),
    fork(watchUserDataSagas),
    fork(watchProfileSaga),
    fork(watchSaveSagas),
    fork(watchProjectUpdateSaga),
    fork(watchCommDataSagas),
    fork(watchLikeSagas),
    fork(watchCommentSagas),
    fork(watchDetailingSagas),
    fork(watchPostCreateSagas),
    fork(watchPostUpdateSagas),
    fork(watchPostDeleteSagas),
    fork(watchItemDeleteSaga),
    fork(watchSearchSaga),
    fork(watchInviteMemberSaga),
    fork(watchResetPasswordSaga),
    fork(watchOrganizationsSaga),
    fork(watchApproveInvitation),
    fork(watchFetchGhostTextSaga),
    fork(watchSnippetRunSaga)
  ]);
}

export default rootSaga;
