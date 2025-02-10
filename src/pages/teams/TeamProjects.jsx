import React, { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { BiComment, BiLike, BiSolidComment, BiSolidLike } from "react-icons/bi";
import { CiWarning } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { GoCodeSquare } from "react-icons/go";
import { MdArrowUpward, MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEditorOpen } from "../../hooks/useEditorOpen";
import LngName from "../../ui/LngName";
import { isCurrUserLiked } from "../../utils/validators";
import Comment from "../community/features/comBody/Comment";
import { fetchProjectsRequest } from "./teamsSlice";
import { deleteItemRequest } from "../profile/profileSlice";
import CreateNewBox from "../community/CreateNewBox";

const Project = ({ project }) => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const openEditor = useEditorOpen();

  const [showComment, setShowComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLiked = isCurrUserLiked(project.likes, user.userId);
  const isLoggedInUser = true;
  const isSnippet = project.type === "snippet";

  const detailProject = () => navigateTo(`/community/project/${project._id}`);

  const handleDelete = () => {
    dispatch(
      deleteItemRequest({ itemName: "project", id: project._id, teamId: id })
    );
    dispatch(fetchProjectsRequest(id));
    setIsDeleting(false);
  };

  useEffect(() => {
    if (!isEqual(project, {})) {
      dispatch(fetchProjectsRequest(id));
    }
  }, [dispatch, id, project]);

  return (
    <div className="sd:w-2/3 flex flex-col gap-3 bg-slate-900 bg-opacity-70 border-[1px] border-slate-800 rounded-md p-3">
      <div className="flex items-start justify-between bg-slate-800 bg-opacity-60 px-4 py-3 rounded-md">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {isLoggedInUser ? (
              <div className="flex items-start gap-3 justify-between">
                <button
                  className="self-start text-wrap text-slate-200 font-semibold tracking-wide hover:underline hover:text-color-5"
                  onClick={detailProject}
                >
                  {project.name}
                </button>
                <div className="relative flex items-center gap-2">
                  {isDeleting ? (
                    <div className="absolute top-0 right-0 w-max flex flex-col gap-3 bg-n-13 border-[1px] border-red-500 p-3 rounded-lg">
                      <div className="flex items-center gap-3 justify-between">
                        <div className="sm:text-base text-red-500 text-sm flex items-center font-semibold gap-2">
                          <CiWarning />
                          Are you sure you want to delete this project?
                        </div>
                        <button
                          className="text-slate-400 hover:text-slate-300"
                          onClick={() => setIsDeleting(false)}
                        >
                          <MdClose />
                        </button>
                      </div>
                      <div className="w-full flex items-center gap-3 justify-end">
                        <button
                          className="flex items-center justify-center gap-2 text-slate-200 bg-slate-500 bg-opacity-40 px-2 py-[3px] rounded-md transition-all duration-300 hover:bg-opacity-60 hover:text-slate-50 font-semibold"
                          onClick={() => setIsDeleting(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex items-center justify-center gap-2 text-slate-200 bg-red-500 bg-opacity-40 px-2 py-[3px] rounded-md transition-all duration-300 hover:bg-opacity-60 hover:text-slate-50 font-semibold"
                          onClick={handleDelete}
                        >
                          <MdDelete />
                          Sure delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        className="text-green-500 bg-slate-500 bg-opacity-40 px-1 py-[3px] rounded-md transition-all duration-300 hover:bg-green-500 hover:text-slate-50"
                        onClick={() =>
                          openEditor("open", project.lngName, project)
                        }
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="text-red-500 bg-slate-500 bg-opacity-40 p-[3px] rounded-md transition-all duration-300 hover:bg-red-500 hover:text-red-50"
                        onClick={() => setIsDeleting(true)}
                      >
                        <MdDelete />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button
                className="self-start text-wrap text-slate-200 font-semibold tracking-wide hover:underline hover:text-color-5"
                onClick={detailProject}
              >
                {project.name}
              </button>
            )}
            <span className="text-slate-300 text-sm">
              {project.description}
            </span>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center flex-wrap gap-3 text-slate-400 text-sm">
              <LngName isSnippet={isSnippet} name={project.lngName} />
              <button
                className="flex items-center gap-2 font-semibold bg-slate-700 bg-opacity-50 px-2 py-[1px] rounded-md transition-all duration-300 hover:underline hover:underline-offset-2 hover:bg-opacity-70"
                onClick={() => openEditor("open", project.lngName, project)}
              >
                <GoCodeSquare />
                <span className="pb-1">Open with editor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TeamProjects() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.teams.projects);

  useEffect(() => {
    dispatch(fetchProjectsRequest(id));
  }, [dispatch, id]);

  return (
    <div>
      <span className="pb-8">
        <CreateNewBox />
      </span>
      {projects?.length > 0 ? (
        <div className="flex flex-col justify-center sd:items-start gap-3 sd:gap-7 px-2 sd:flex-row sd:flex-wrap pb-3">
          {projects.map((project, index) => (
            <Project project={project} key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full pb-40">
          <span className="text-slate-300 text-lg">
            Team has no projects yet, create one.
          </span>
        </div>
      )}
    </div>
  );
}

export default TeamProjects;
