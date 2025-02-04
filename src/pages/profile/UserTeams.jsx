
import { isEqual } from "lodash";
import { useState } from "react";
import { CiWarning } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdCheck, MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";

const dummyTeams = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
    { id: 3, name: "Team Gamma" },
];

const Team = ({ team }) => {
    const { user, isUserSignedIn } = useSelector((state) => state.auth);
    const { userId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [teamName, setTeamName] = useState(team.name);
    const dispatch = useDispatch();

    const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);

    const handleDelete = () => {
        console.log("Deleting team: ", team.id);
        setIsDeleting(false);
    };

    const handleUpdate = () => {
        console.log("Updating team name to: ", teamName);
        setIsEditing(false);
    };

    return (
      <> 
            <div className="flex items-center justify-between bg-slate-800 bg-opacity-60 px-4 py-3 rounded-md">
                {isEditing ? (
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="bg-slate-700 text-slate-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-color-5"
                    />
                ) : (
                    <span className="text-slate-200 font-semibold">{team.name}</span>
                )}

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <button
                            className="text-green-500 bg-slate-500 bg-opacity-40 px-2 py-1 rounded-md transition-all duration-300 hover:bg-green-500 hover:text-slate-50"
                            onClick={handleUpdate}
                        >
                            <MdCheck />
                        </button>
                    ) : (
                        <button
                            className="text-blue-500 bg-slate-500 bg-opacity-40 px-2 py-1 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-slate-50"
                            onClick={() => setIsEditing(true)}
                        >
                            <FaEdit />
                        </button>
                    )}

                    <button
                        className="text-red-500 bg-slate-500 bg-opacity-40 px-2 py-1 rounded-md transition-all duration-300 hover:bg-red-500 hover:text-slate-50"
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

    const teams = dummyTeams;
    const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);

	return teams.length > 0 ? (
		<div className="flex flex-col justify-center sd:items-start gap-3 sd:gap-7 px-2 sd:flex-row sd:flex-wrap pb-3 w-full">

				<div className="w-11/12 sm:w-3/4 flex flex-col gap-3 bg-slate-900 bg-opacity-70 border-[1px] border-slate-800 rounded-md p-3">
			{teams.map((team, index) => (
					<Team team={team} key={index} />
			))}
		</div>
		
		</div>
	) : (
			<div className="flex flex-col items-center justify-center gap-3 w-full h-full pb-40">
				{isLoggedInUser ? (
					<>
						<span className="text-slate-300 text-lg">
							You have no teams yet, create one now.
						</span>
						<button
							className="text-slate-300 bg-slate-700 bg-opacity-60 px-4 py-2 rounded-full transition-all duration-300 hover:text-slate-50 hover:bg-opacity-80"
							onClick={() => console.log("Open team creation form")}
						>
							Create Team
						</button>
					</>
				) : (
						<>
							<span className="text-slate-300 font-semibold tracking-wide text-lg">
								No teams yet.
							</span>
						</>
					)}
			</div>
		);
};

export default UserTeams;

