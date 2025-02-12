import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  approveInvitationRequest,
  resetInvitationState,
} from "./approveInvitationSlice";

const ApproveInvitation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading, isApproved, error } = useSelector(
    (state) => state.approveInvitation
  );

  console.log(isLoading, isApproved, error);

  const teamId = searchParams.get("teamId");
  const token = searchParams.get("token");
  console.log(teamId, token);

  useEffect(() => {
    if (teamId && token) {
      dispatch(approveInvitationRequest({ teamId, token }));
    }
  }, [dispatch, teamId, token]);

  const handleLoginRedirect = () => {
    navigate("/login");
    dispatch(resetInvitationState());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="w-full max-w-md bg-slate-800 bg-opacity-70 rounded-lg border-2 border-slate-700 p-8 text-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-500 border-t-slate-200 rounded-full animate-spin" />
            <span className="text-slate-300 text-lg">
              Checking invitation status...
            </span>
          </div>
        )}

        {isApproved && (
          <div className="flex flex-col items-center gap-4">
            <BsCheckCircleFill className="text-6xl text-green-500" />
            <h1 className="text-2xl font-bold text-slate-100">
              Invitation Accepted!
            </h1>
            <p className="text-slate-300">
              Your invitation has been successfully approved. You can now log in
              to access your account. You can now close this page.
            </p>
            {/* <button
              onClick={handleLoginRedirect}
              className="mt-4 px-6 py-2 bg-color-5 bg-opacity-80 text-white font-semibold rounded-md hover:bg-green-500 transition-all duration-300"
            >
              Go to Login
            </button> */}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4">
            <BsXCircleFill className="text-6xl text-red-500" />
            <h1 className="text-2xl font-bold text-slate-100">
              Invitation Failed
            </h1>
            <p className="text-slate-300">
              There was an issue processing your invitation. Please contact
              support or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-color-5 bg-opacity-80 text-white font-semibold rounded-md hover:bg-red-500 transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveInvitation;
