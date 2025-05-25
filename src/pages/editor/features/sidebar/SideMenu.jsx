import { useSelector } from "react-redux";
import Explore from "./Explore";
import Settings from "./Setting";
import SideSearch from "./SideSearch";
import Chat from "./Chat";

const SideMenu = () => {
  const { currTab, currTabTitle } = useSelector((state) => state.sidebar);
  return (
    <div className="bg-[#22252d] h-full w-full flex flex-col">
      <div className="py-2 px-5 shadow-sm shadow-slate-700">
        <span className=" uppercase text-slate-500 text-sm  line-clamp-1 ">
          {currTabTitle}
        </span>
      </div>
      {currTab === "explore" ? (
        <Explore />
      ) : currTab === "search" ? (
        <SideSearch />
      ) : currTab === "chat" ? (
        <Chat />
      ) : (
        currTab === "setting" && <Settings />
      )}
    </div>
  );
};

export default SideMenu;
