import React from "react";
import Header from "../../features/header/Header";
import TeamsTabs from "./TeamsTabs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TeamOverview from "./TeamOverview";
import TeamProjects from "./TeamProjects";
import TeamMembers from "./TeamMembers";

function TeamsPage() {
  const { userId } = useParams();
  const { isUserSignedIn, user } = useSelector((state) => state.auth);
  const { currTab } = useSelector((state) => state.teams);

  // const { currTab, userData, profileChanged } = useSelector(
  //   (state) => state.profile
  // );
  const isLoggedInUser = isUserSignedIn && userId === user.userId;

  const teamData = {
    projects: [],
    members: [],
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className=" mt-[4rem] items-center flex flex-col   p-2 pb-0 so:pb-0 so:p-7">
        <TeamsTabs
          classes={
            "hidden  flex justify-center sm:flex items-center gap-2 p-2 rounded-lg bg-slate-900 bg-opacity-70 border-2 border-slate-800"
          }
          isLoggedInUser={isLoggedInUser}
          tabData={[teamData.projects.length, teamData.members.length]}
        />
        <div className=" overflow-x-hidden  min-w-[60vw]  h-[58.5dvh] sm:h-[98dvh] small-scroll mt-3 sd:mt-7 mb-1">
          {currTab === "overview" && <TeamOverview />}
          {currTab === "projects" && <TeamProjects />}
          {currTab === "members" && <TeamMembers />}
        </div>
      </div>
    </div>
  );
}

export default TeamsPage;
