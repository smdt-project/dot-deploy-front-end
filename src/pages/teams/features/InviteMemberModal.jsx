import { MdClose } from "react-icons/md";
import { useState } from "react";

const InviteMemberModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorState, setError] = useState(null);

  const handleInviteMember = async () => {
    if (email.length === 0) return;
    setLoading(true);

    try {
      await onInvite(email);
      setEmail("");
      onClose();
    } catch (err) {
      setError("Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute left-0 top-0 z-[999] w-[100dvw] h-[99dvh] backdrop-blur-sm flex items-start justify-center py-5">
      <div className="min-w-[75%] sm:min-w-[60%] sd:min-w-[50%] d:min-w-[40%] flex flex-col gap-2 p-5 mt-1 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-lg shadow-n-7">
        <div className="flex items-center justify-between gap-2 text-slate-300 font-bold text-lg pb-2">
          <span>{loading ? "Inviting Member..." : "Invite Member"}</span>
          <button
            className="bg-slate-700 p-[2px] bg-opacity-70 text-slate-400 rounded-md transition-all duration-300 hover:text-slate-300 hover:bg-opacity-100"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>

        {!loading && !errorState && (
          <>
            <div className="max-h-[70dvh] flex flex-col gap-4 pr-2 overflow-y-scroll small-scroll">
              <div className="flex flex-col gap-1 bg-slate-700 px-1 rounded-md py-1 bg-opacity-30 border-l-4 border-slate-700">
                <span className="text-slate-400">
                  Email{" "}
                  <span
                    className={
                      email.length > 0 ? "text-color-4" : "text-red-500 text-lg"
                    }
                  >
                    *
                  </span>
                </span>
                <input
                  type="email"
                  className="bg-transparent border-b-2 border-slate-700 px-2 py-1 placeholder:text-slate-500 placeholder:text-sm text-slate-200 font-semibold outline-none transition-all duration-300 focus:border-slate-500 sm:min-h-10 min-h-8"
                  placeholder="Enter member's email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 py-4">
              <button
                className="text-slate-400 tracking-wide font-semibold py-1 px-4 rounded-md transition-all duration-300 hover:bg-opacity-100 hover:text-slate-200 capitalize"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`${
                  email.length === 0
                    ? "bg-opacity-15"
                    : "bg-opacity-40 hover:bg-opacity-100"
                } bg-color-5 text-slate-200 tracking-wide font-semibold py-1 px-4 rounded-full transition-all duration-300 capitalize`}
                onClick={handleInviteMember}
                disabled={email.length === 0}
              >
                Invite
              </button>
            </div>
          </>
        )}

        {loading && (
          <div className="flex-grow flex items-center justify-center h-[10dvh]">
            <span className="text-slate-400">
              Please wait, while we send the invitation...
            </span>
          </div>
        )}

        {errorState && (
          <div className="flex-grow flex flex-col gap-5 items-center justify-center h-[50dvh]">
            <span className="text-red-500">{errorState}</span>
            <button
              className="text-color-5 hover:underline hover:underline-offset-2"
              onClick={() => setError(null)}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;
