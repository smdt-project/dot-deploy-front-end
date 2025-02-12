import { Outlet } from "react-router-dom";
import EditorFooter from "./EditorFooter";
import EditorHeader from "./features/editorheader/EditorHeader";
import EditorSidebar from "./features/sidebar/EditorSidebar";
import { useSelector } from "react-redux";
import CommitBox from "./CommitBox";

const EditorPage = () => {
  const { isCommititng } = useSelector((state) => state.project);
  return (
    <div className="relative flex-col transition-all duration-500">
      <EditorHeader />
      <div className="flex h-[92dvh]">
        <EditorSidebar />
        <Outlet />
      </div>
      {isCommititng && <CommitBox />}
      <EditorFooter />
    </div>
  );
};

export default EditorPage;
