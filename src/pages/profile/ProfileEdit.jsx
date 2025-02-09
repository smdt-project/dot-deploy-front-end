import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgPassword } from "react-icons/cg";
import { updatePasswordRequest } from "./profileSlice";

const inputClasses =
  "bg-slate-800 bg-opacity-60 outline-none rounded-md px-2 py-1 placeholder:text-slate-300 text-slate-200 text-semibold transition-all duration-300 border-slate-800 border-opacity-60 border-[1px] focus:border-slate-600 placeholder:text-slate-600";

const PasswordChange = () => {
  const dispatch = useDispatch();
  const { isLoading, passwordUpdateSuccess, error } = useSelector(
    (state) => state.profile
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [inputErr, setInputErr] = useState("");

  const handleSubmit = () => {
    setInputErr("");

    if (newPassword.length < 6) {
      setInputErr("Password must be at least 6 characters long.");
      return;
    }

    dispatch(updatePasswordRequest({ oldPassword, newPassword }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-color-2">
        <CgPassword />
        <span>Password</span>
        <div className="flex-grow h-[1px] bg-slate-800" />
      </div>
      <div className="flex flex-col d:flex-row gap-5">
        <div className="w-fit d:w-[25rem] p-3 rounded-lg flex flex-col gap-3 bg-slate-900 bg-opacity-70 border-[1px] border-color-2 border-opacity-40">
          {inputErr && <span className="text-red-500">{inputErr}</span>}
          {passwordUpdateSuccess && (
            <span className="text-green-500">
              Password updated successfully!
            </span>
          )}
          {error && <span className="text-red-500">{error}</span>}

          <div className="flex items-center gap-2 justify-between">
            <span className="text-slate-400">Old password:</span>
            <input
              type="password"
              className={inputClasses}
              placeholder="Old password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            <span className="text-slate-400">New password:</span>
            <input
              type="password"
              className={inputClasses}
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`bg-slate-800 text-slate-300 self-end px-3 py-1 rounded-md transition-all duration-300 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-700 hover:text-slate-100"
            }`}
          >
            {isLoading ? "Updating..." : "Change"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileEdit = () => {
  return (
    <div className="flex flex-col gap-7 pt-5 sm:pt-7 w-full pr-3">
      <div className="flex flex-col sds:flex-row gap-5 sm:gap-7">
        <PasswordChange />
      </div>
    </div>
  );
};

export default ProfileEdit;
