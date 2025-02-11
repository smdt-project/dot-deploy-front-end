import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordRequest } from "./resetPasswordSlice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, error, isPasswordReset } = useSelector(
    (state) => state.resetPassword
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const handleResetPassword = () => {
    if (!token) {
      alert("Invalid or missing token");
      return;
    }
    dispatch(resetPasswordRequest({ token, password, confirmPassword }));
  };

  useEffect(() => {
    if (isPasswordReset) {
      navigateTo("/login");
    }
  }, [isPasswordReset, navigateTo]);

  return (
    <div className="w-[90dvh] sm:w-auto flex flex-col text-slate-400 items-center gap-5 justify-center p-10">
      <div
        className="self-start text-slate-500 ml-[20%] flex items-center tracking-wider rounded-md transition-all duration-300 underline underline-offset-4 hover:text-color-7 cursor-pointer"
        onClick={() => navigateTo("/login")}
      >
        <IoIosArrowBack />
        <span>Back to Login</span>
      </div>
      {isLoading && <span>Loading...</span>}
      {error && <span className="text-red-500">{error}</span>}
      {isPasswordReset ? (
        <span className="text-green-500">Password reset successfully!</span>
      ) : (
        <div className="w-[27rem] flex flex-col gap-4 bg-slate-800 p-7 rounded-lg">
          <div className="flex flex-col gap-1 bg-slate-700 px-2 py-1 rounded-md border-l-4 border-color-5">
            <span className="text-slate-200 font-bold text-xl">
              Reset Password
            </span>
            <span className="text-slate-400">
              Enter your new password below.
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              className="bg-slate-700 border-2 rounded-md px-2 py-1 text-slate-200 outline-none focus:border-slate-600"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="bg-slate-700 border-2 rounded-md px-2 py-1 text-slate-200 outline-none focus:border-slate-600"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              className="bg-slate-600 border-2 rounded-md px-2 text-slate-300 font-bold tracking-wide text-lg outline-none transition-all duration-300 hover:bg-slate-500"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
