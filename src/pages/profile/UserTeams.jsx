import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import CreateModal from "../teams/features/CreateModal.jsx";
import { fetchTeamsRequest, deleteTeamRequest } from "./createTeamSlice.js";

const Team = ({ team }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTeamRequest(team.id));
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex justify-between bg-slate-800 bg-opacity-60 px-4 py-3 rounded-md">
        <div className="flex flex-col">
          <NavLink
            to={`/teams/${team.id}`}
            className="text-slate-200 font-semibold hover:text-slate-400"
          >
            {team.name}
          </NavLink>
          <span className="text-slate-400 text-sm mt-1">
            {team.description}
          </span>
          <span className="text-slate-600 text-sm mt-1">
            {Array.isArray(team.members) ? team.members.length : team.members}{" "}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-red-500 h-6 bg-slate-500 bg-opacity-40 px-2 py-1 rounded-md transition-all duration-300 hover:bg-red-500 hover:text-slate-50"
            onClick={() => setIsDeleting(true)}
          >
            <MdDelete />
          </button>
        </div>
      </div>
      {isDeleting && (
        <div className="p-3 bg-n-13 border-[1px] border-red-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="sm:text-base text-red-500 text-sm flex items-center font-semibold gap-2">
              <CiWarning /> Are you sure you want to delete this team?
            </div>
            <button
              className="text-slate-400 hover:text-slate-300"
              onClick={() => setIsDeleting(false)}
            >
              <MdClose />
            </button>
          </div>
          <div className="flex items-center gap-3 justify-end mt-3">
            <button
              className="text-slate-200 bg-slate-500 bg-opacity-40 px-2 py-1 rounded-md hover:bg-opacity-60"
              onClick={() => setIsDeleting(false)}
            >
              Cancel
            </button>
            <button
              className="text-slate-200 bg-red-500 bg-opacity-40 px-2 py-1 rounded-md hover:bg-opacity-60"
              onClick={handleDelete}
            >
              Sure Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const UserTeams = () => {
  const dispatch = useDispatch();
  const { user, isUserSignedIn } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const { teams, loading, error } = useSelector((state) => state.createTeam);
  const [isCreating, setIsCreating] = useState(false);
  const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);

  useEffect(() => {
    dispatch(fetchTeamsRequest());
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-center sd:items-start gap-3 px-2 sd:flex-row sd:flex-wrap pb-3 w-full">
      {isLoggedInUser && (
        <div className="w-full flex justify-center sd:justify-start">
          <button
            className="text-slate-300 bg-slate-700 px-4 py-2 rounded-full hover:text-slate-50"
            onClick={() => setIsCreating(true)}
          >
            Create Team
          </button>
        </div>
      )}

      {isCreating && (
        <CreateModal
          isCreatingTeam={true}
          onClose={() => setIsCreating(false)}
        />
      )}

      {loading ? (
        <div className="text-slate-300">Loading teams...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : teams?.length > 0 ? (
        <div className="sm:w-2/3 flex flex-col gap-3 bg-slate-900 bg-opacity-70 border-[1px] border-slate-800 rounded-md p-3">
          {teams?.map((team) => (
            <Team team={team} key={team.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full pb-40">
          {isLoggedInUser ? (
            <span className="text-slate-300 text-lg">
              You have no teams yet, create one now.
            </span>
          ) : (
            <span className="text-slate-300 font-semibold tracking-wide text-lg">
              User has no teams yet.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTeams;
