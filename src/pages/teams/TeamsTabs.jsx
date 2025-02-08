import { BsPeople } from "react-icons/bs";
import { FaProjectDiagram } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrTab } from "./teamsSlice";

const tabs = [
  { name: "overview", userT: "Overview", icon: <MdOutlineDashboard /> },
  { name: "projects", userT: "Projects", icon: <FaProjectDiagram /> },
  { name: "members", userT: "Members", icon: <BsPeople /> },
];

const TeamTabButton = ({ tab, isSideBar }) => {
  const { currTab } = useSelector((state) => state.teams);
  const dispatch = useDispatch();

  const handleClick = () => dispatch(changeCurrTab(tab.name));

  return (
    <button
      className={`${
        currTab === tab.name
          ? "bg-color-7 text-slate-50"
          : "bg-slate-700 bg-opacity-50 text-slate-300"
      } relative font-semibold flex items-center justify-between gap-2 px-2 py-1 rounded-sm transition-all duration-300 hover:bg-color-7 hover:text-slate-50 text-[12px] sm:text-base`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        <div className="text-[12px] sm:text-base">{tab.icon}</div>
        <span className="capitalize ">{tab.userT}</span>
      </div>
      <span
        className={`${
          isSideBar ? "" : "hidden s:flex"
        } text-slate-300 bg-slate-700 rounded-full shadow-sm shadow-slate-900 h-5 flex items-center justify-center sm:h-auto px-1`}
      >
        {tab.len}
      </span>
    </button>
  );
};

const TeamsTabs = ({ classes, isSideBar, tabData }) => {
  return (
    <div className={classes}>
      {tabs.map((tab, index) => (
        <TeamTabButton
          key={index}
          tab={{
            ...tab,
            len: tab.name === "overview" ? null : tabData[index - 1],
          }}
          isSideBar={isSideBar}
        />
      ))}
    </div>
  );
};

export default TeamsTabs;
