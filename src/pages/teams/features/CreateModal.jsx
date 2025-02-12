import { MdClose } from "react-icons/md";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTeamRequest,
} from "../../profile/organizationsSlice";

const CreateModal = ({ isCreatingTeam = false, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.organizations);

  const handleCreateTeam = async () => {
    if (name.trim() === "" || description.trim() === "") return;
    dispatch(createTeamRequest({ name, description }));
  };

  useEffect(() => {
    if (!isCreatingTeam) {
      setName("");
      setDescription("");
    }
  }, [isCreatingTeam]);

  return (
    <div className="absolute left-0 top-0 z-[999] w-[100dvw] h-[99dvh] backdrop-blur-sm flex items-start justify-center py-5">
      <div className="min-w-[75%] sm:min-w-[60%] sd:min-w-[50%] d:min-w-[40%] flex flex-col gap-2 p-5 mt-1 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-lg shadow-n-7">
        <div className="flex items-center justify-between gap-2 text-slate-300 font-bold text-lg pb-2">
          <span>{loading ? "Creating Team..." : "Create Team"}</span>
          <button
            className="bg-slate-700 p-[2px] bg-opacity-70 text-slate-400 rounded-md transition-all duration-300 hover:text-slate-300 hover:bg-opacity-100"
            onClick={onClose}
            disabled={loading}
          >
            <MdClose />
          </button>
        </div>

        {!loading && !error && (
          <>
            <div className="max-h-[70dvh] flex flex-col gap-4 pr-2 overflow-y-scroll small-scroll">
              <div className="flex flex-col gap-1 bg-slate-700 px-1 rounded-md py-1 bg-opacity-30 border-l-4 border-slate-700">
                <span className="text-slate-400">
                  {isCreatingTeam && "Team Name"}{" "}
                  <span
                    className={
                      name.length > 0 ? "text-color-4" : "text-red-500 text-lg"
                    }
                  >
                    *
                  </span>
                </span>
                <input
                  type="text"
                  className="bg-transparent border-b-2 border-slate-700 px-2 py-1 placeholder:text-slate-500 placeholder:text-sm text-slate-200 font-semibold outline-none transition-all duration-300 focus:border-slate-500 sm:min-h-10 min-h-8"
                  placeholder={isCreatingTeam && "Enter team name"}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="flex flex-col bg-slate-700 px-1 rounded-md py-1 bg-opacity-30 border-l-4 border-slate-700">
                <span className="text-slate-400">
                  Description{" "}
                  <span
                    className={
                      description.length > 0
                        ? "text-color-4"
                        : "text-red-500 text-lg"
                    }
                  >
                    *
                  </span>
                </span>
                <input
                  type="text"
                  className="border-b-2 border-slate-700 bg-transparent px-2 py-1 placeholder:text-slate-500 placeholder:text-sm text-slate-200 font-semibold outline-none transition-all duration-300 focus:border-slate-500 small-scroll"
                  placeholder={
                    isCreatingTeam
                      ? "Enter team description"
                      : "Add description for your post"
                  }
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 py-4">
              <button
                className="text-slate-400 tracking-wide font-semibold py-1 px-4 rounded-md transition-all duration-300 hover:bg-opacity-100 hover:text-slate-200 capitalize"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`${
                  name.length === 0 || description.length === 0
                    ? "bg-opacity-15"
                    : "bg-opacity-40 hover:bg-opacity-100"
                } bg-color-5 text-slate-200 tracking-wide font-semibold py-1 px-4 rounded-full transition-all duration-300 capitalize`}
                onClick={handleCreateTeam}
                disabled={name.length === 0 || description.length === 0 || loading}
              >
                Submit
              </button>
            </div>
          </>
        )}

        {loading && (
          <div className="flex-grow flex items-center justify-center h-[10dvh]">
            <span className="text-slate-400">
              Please wait, while we create your team...
            </span>
          </div>
        )}

        {error && (
          <div className="flex-grow flex flex-col gap-5 items-center justify-center h-[50dvh]">
            <span className="text-red-500">{error}</span>
            <button
              className="text-color-5 hover:underline hover:underline-offset-2"
              onClick={handleCreateTeam}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateModal;
