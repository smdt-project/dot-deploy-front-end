import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { forgotPasswordRequest } from "../signin/signInSlice";

const ForgetPasswordModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.signIn);
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (email.trim().length === 0) return;
    dispatch(forgotPasswordRequest({ email }));
    setEmail("");
    onClose();
  };

  return (
    <div className="absolute left-0 top-0 z-[999] w-[100dvw] h-[99dvh] backdrop-blur-sm flex items-start justify-center py-5">
      <div className="d:w-[52%] flex flex-col items-center gap-4 justify-between p-3 rounded-lg bg-slate-900 bg-opacity-70 border-[1px] border-color-2 border-opacity-40">
        <div className="flex items-center justify-between w-full">
          <span className="text-slate-400 text-lg font-semibold">
            Forgot Password?
          </span>
          <button
            className="bg-slate-700 p-[2px] bg-opacity-70 text-slate-400 rounded-md transition-all duration-300 hover:text-slate-300 hover:bg-opacity-100"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <span className="text-slate-400">
            Enter your email address below, and we'll send you a link to reset
            your password.
          </span>
          <input
            type="email"
            className="bg-transparent border-b-2 border-slate-700 px-2 py-1 placeholder:text-slate-500 placeholder:text-sm text-slate-200 font-semibold outline-none transition-all duration-300 focus:border-slate-500 sm:min-h-10 min-h-8 w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        {error && <span className="text-red-500">{error}</span>}

        <button
          className={`bg-color-2 bg-opacity-40 text-slate-300 self-end px-3 py-1 rounded-md transition-all duration-300 hover:bg-opacity-100 hover:text-slate-900 ${
            email.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleResetPassword}
          disabled={email.length === 0 || isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Email"}
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
