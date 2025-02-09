import { isEqual } from "lodash";
import { useState } from "react";
import { CiWarning } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdCheck, MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import CreateModal from "../teams/features/CreateModal.jsx";

const dummyTeams = [
  { id: 1, name: "Team Alpha", description: "This is the description for team alpha", members: 5 },
  { id: 2, name: "Team Beta", description: "This is the description for team beta", members: 8 },
  { id: 3, name: "Team Gamma", description: "This is the description for team gamma", members: 3 },
];

const Team = ({ team, onDelete, onUpdate }) => {
  const { user, isUserSignedIn } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [teamName, setTeamName] = useState(team.name);
  const [teamDescription, setTeamDescription] = useState(team.description);
  const dispatch = useDispatch();

  const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);

  const handleDelete = () => {
    onDelete(team.id);
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    onUpdate(team.id, teamName);
    onUpdate(team.id, teamDescription);
    setIsEditing(false);
  };

  const handleCreate = () => {
    setIsCreating(false);
  }

  return (
    <>
      <div className="flex justify-between bg-slate-800 bg-opacity-60 px-4 py-3 rounded-md">
        <div className="flex flex-col">
          <NavLink to={`/teams`} className="text-slate-200 font-semibold hover:text-slate-400">
            {team.name}
          </NavLink>
          <span className="text-slate-400 text-sm mt-1">{team.description}</span>
          <span className="text-slate-600 text-sm mt-1">{team.members} Member(s)</span>
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
              <CiWarning />
              Are you sure you want to delete this team?
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
              className="text-slate-200 bg-slate-500 bg-opacity-40 px-2 py-1 rounded-md transition-all duration-300 hover:bg-opacity-60 hover:text-slate-50 font-semibold"
              onClick={() => setIsDeleting(false)}
            >
              Cancel
            </button>
            <button
              className="text-slate-200 bg-red-500 bg-opacity-40 px-2 py-1 rounded-md transition-all duration-300 hover:bg-opacity-60 hover:text-slate-50 font-semibold"
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
  const { user, isUserSignedIn } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [teams, setTeams] = useState(dummyTeams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);

  const handleDelete = (id) => {
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
  };

  const handleUpdate = (id, newName) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, name: newName } : team
      )
    );
  };

  return teams.length > 0 ? (
    <div className="flex flex-col justify-center sd:items-start gap-3 sd:gap-7 px-2 sd:flex-row sd:flex-wrap pb-3 w-full">
      <div className="sm:w-2/3 flex flex-col gap-3 bg-slate-900 bg-opacity-70 border-[1px] border-slate-800 rounded-md p-3">
        {teams.map((team) => (
          <Team team={team} key={team.id} onDelete={handleDelete} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  ) : (
      <div className="flex flex-col items-center justify-center gap-3 w-full h-full pb-40">
        {isLoggedInUser ? (
          <>
            {isCreating && (
              <CreateModal
                isCreatingTeam={true}
                onClose={() => setIsCreating(false)}
                setTeams={setTeams}
              />
            )}
            <span className="text-slate-300 text-lg">
              You have no teams yet, create one now.
            </span>
            <button
              className="text-slate-300 bg-slate-700 bg-opacity-60 px-4 py-2 rounded-full transition-all duration-300 hover:text-slate-50 hover:bg-opacity-80"
              onClick={() => setIsCreating(true)}
            >
              Create Team
            </button>
          </>
        ) : (
            <>
              <span className="text-slate-300 font-semibold tracking-wide text-lg">
                User has no teams yet.
              </span>
            </>
          )}
      </div>
    );
};

export default UserTeams;

