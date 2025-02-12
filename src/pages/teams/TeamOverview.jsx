import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoPeopleSharp } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { GiTeamIdea } from "react-icons/gi";
import CreateNewBox from "../community/CreateNewBox";
import InviteMemberModal from "./features/InviteMemberModal";
import { fetchProjectsRequest, inviteMemberRequest } from "./teamsSlice";
import { fetchTeamsRequest } from "../profile/organizationsSlice";

const TeamOverview = () => {
  const { id } = useParams();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.organizations);
  const projects = useSelector((state) => state.teams.projects);

  const team = teams.find((team) => team._id === id);

  const handleInviteMember = (email) => {
    if (id) {
      dispatch(inviteMemberRequest({ email, teamId: id }));
    }
  };

  useEffect(() => {
    dispatch(fetchTeamsRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProjectsRequest(id));
  }, [dispatch]);

  return (
    <div className="flex flex-col text-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="text-[28px] sm:text-4xl text-[#858DFF]">
            <GiTeamIdea />
          </div>
          <span className="text-xl sm:text-2xl font-semibold capitalize">
            {team?.name}
          </span>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-1.5 px-4 rounded-full text-sm shadow-lg border border-blue-300/30 backdrop-blur-md">
            <FaCode className="mr-2 text-lg drop-shadow-sm" />
            {projects?.length == 0 ? (
              <span className="font-medium">No Projects</span>
            ) : (
              <span className="font-medium">
                {projects?.length}
                {`${projects.length == 1 ? "Project" : "Projects"}`}{" "}
              </span>
            )}
          </div>

          <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-400 text-white py-1.5 px-4 rounded-full text-sm shadow-lg border border-green-300/30 backdrop-blur-md">
            <IoPeopleSharp className="mr-2 text-lg drop-shadow-sm" />
            <span className="font-medium">
              {team ? team?.members.length : ""} Members
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4  rounded-lg shadow-md">
        <p className="text-center text-lg sm:text-xl font-medium">
          We think you’re gonna like it here.
        </p>
        <p className="text-center text-sm sm:text-base text-gray-400 mt-2">
          We’ve suggested some quick actions here in your team's overview to
          help you get started.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <div className="text-[28px] sm:text-4xl text-[#858DFF]">
            <FaCode />
          </div>
          <span className="text-xl sm:text-2xl font-semibold capitalize">
            Create Project
          </span>
        </div>
        <div className="mt-4 p-4 flex flex-col items-center gap-4 bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <p className="text-center text-lg sm:text-xl font-medium">
            Start a new project for your team.
          </p>
          <span className="">
            <CreateNewBox />
          </span>
        </div>
      </div>

      {/* Invite Members Section */}
      <div className="mt-8 flex flex-col items-center">
        <div className="w-1 h-20 bg-gray-600"></div>

        <div className="flex items-center gap-4">
          <div className="text-[28px] sm:text-4xl text-[#858DFF]">
            <IoPeopleSharp />
          </div>
          <span className="text-xl sm:text-2xl font-semibold capitalize">
            Invite Members
          </span>
        </div>
        <div className="mt-4 p-4 flex flex-col items-center bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <p className="text-center text-lg sm:text-xl font-medium">
            Invite new members to join your team.
          </p>
          <button
            className="mt-4 p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <div className="flex items-center gap-1">
              <IoPeopleSharp className="mr-2 text-lg drop-shadow-sm" />
              <span>Invite Members</span>
            </div>
          </button>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <InviteMemberModal
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteMember}
        />
      )}
    </div>
  );
};

export default TeamOverview;
