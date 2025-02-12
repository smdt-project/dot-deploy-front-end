import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../features/header/Header";
import TeamsTabs from "./TeamsTabs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TeamOverview from "./TeamOverview";
import TeamProjects from "./TeamProjects";
import TeamMembers from "./TeamMembers";
import { MdArrowBack } from "react-icons/md";
import { fetchTeamsRequest } from "../profile/organizationsSlice";
import { fetchProjectsRequest } from "./teamsSlice";

function TeamsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { teams } = useSelector((state) => state.organizations);
  const projects = useSelector((state) => state.teams.projects);
  const dispatch = useDispatch();

  const team = teams.find((team) => team._id === id);

  const { userId } = useParams();
  const { isUserSignedIn, user } = useSelector((state) => state.auth);
  const { currTab } = useSelector((state) => state.teams);

  const isLoggedInUser = isUserSignedIn && userId === user.userId;

  useEffect(() => {
    dispatch(fetchTeamsRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProjectsRequest(id));
  }, [dispatch]);

  const teamData = {
    projects,
    members: team?.members,
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="mt-[4rem] items-center flex flex-col p-2 pb-0 so:pb-0 so:p-7">
        <button
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-2 text-slate-300 hover:text-slate-100 transition-all bg-slate-800 bg-opacity-70 px-3 py-2 rounded-lg mb-3"
        >
          <MdArrowBack /> Back
        </button>
        <TeamsTabs
          classes="hidden flex justify-center sm:flex items-center gap-2 p-2 rounded-lg bg-slate-900 bg-opacity-70 border-2 border-slate-800"
          isLoggedInUser={isLoggedInUser}
          tabData={[teamData?.projects?.length, teamData?.members?.length]}
        />
        <div className="overflow-x-hidden min-w-[60vw] h-[58.5dvh] sm:h-[98dvh] small-scroll mt-3 sd:mt-7 mb-1">
          {currTab === "overview" && <TeamOverview />}
          {currTab === "projects" && <TeamProjects />}
          {currTab === "members" && <TeamMembers />}
        </div>
      </div>
    </div>
  );
}

export default TeamsPage;
