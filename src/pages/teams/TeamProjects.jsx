import React from "react";
import { isEqual } from "lodash";
import { useState } from "react";
import { BiComment, BiLike, BiSolidComment, BiSolidLike } from "react-icons/bi";
import { CiWarning } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { GoCodeSquare } from "react-icons/go";
import { MdArrowUpward, MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEditorOpen } from "../../hooks/useEditorOpen";
import LngName from "../../ui/LngName";
import { isCurrUserLiked } from "../../utils/validators";
import Comment from "../community/features/comBody/Comment";

// const projects = [
//   {
//     _id: "1",
//     name: "Project 1",
//     description: "This is project 1",
//     lngName: "dotcode",
//     type: "project",
//     likes: [
//       {
//         _id: "1",
//         userId: "1",
//       },
//     ],
//     comments: [
//       {
//         _id: "1",
//         comment: "This is a comment",
//         userId: "1",
//         userName: "User 1",
//         userAvatar: "https://randomuser.me/api/portraits",
//       },
//     ],
//   },
// ];

const Project = ({ project }) => {
  const { user, isUserSignedIn } = useSelector((state) => state.auth);
  const { userId } = useParams();

  const [showComment, setShowComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const comments = project.comments;
  const likes = project.likes;

  const isLiked = isCurrUserLiked(project.likes, user.userId);
  const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);
  const isSnippet = project.type === "snippet";

  const openEditor = useEditorOpen();

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const detailProject = () => navigateTo(`/community/project/${project._id}`);

  const handleDelete = () => {
    // dispatch(deleteItemRequest({ itemName: "project", id: project._id }));
    setIsDeleting(false);
  };

  return (
    <div className="sd:w-2/3 flex flex-col gap-3 bg-slate-900 bg-opacity-70 border-[1px] border-slate-800 rounded-md p-3">
      <div className="flex items-start justify-between bg-slate-800 bg-opacity-60 px-4 py-3 rounded-md">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {isLoggedInUser ? (
              <div className="flex items-start gap-3 justify-between ">
                <button
                  className="self-start text-wrap text-slate-200 font-semibold tracking-wide hover:underline hover:text-color-5"
                  onClick={() => detailProject()}
                >
                  {project.name}
                </button>
                <div className="relative flex items-center gap-2">
                  {isDeleting ? (
                    <div className=" absolute top-0 right-0 w-max flex flex-col gap-3 bg-n-13 border-[1px] border-red-500 p-3 rounded-lg">
                      <div className="flex items-center gap-3 justify-between">
                        <div className="sm:text-base text-red-500 text-sm flex items-center font-semibold gap-2">
                          <div className=" ">
                            <CiWarning />
                          </div>
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
                          <span>Cancel </span>
                        </button>
                        <button
                          className="flex items-center justify-center gap-2 text-slate-200 bg-red-500 bg-opacity-40 px-2 py-[3px] rounded-md transition-all duration-300 hover:bg-opacity-60 hover:text-slate-50 font-semibold"
                          onClick={() => handleDelete()}
                        >
                          <MdDelete />
                          <span>Sure delete</span>
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
                onClick={() => detailProject()}
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
                <span className="pb-1">open with editor</span>
              </button>
            </div>
            <div className="self-end flex items-center gap-2 text-sm">
              <div className="flex items-center text-slate-400 border-[1px] border-slate-700  rounded-md bg-slate-800 bg-opacity-80">
                <div
                  className={`px-2 py-[3px]  rounded-l-md transition-all duration-300 ${
                    isLiked ? "text-color-2 bg-slate-700" : ""
                  }`}
                >
                  {isLiked ? <BiSolidLike /> : <BiLike />}
                </div>
                <span className="flex-grow px-2 border-l-[1px] border-slate-700 text-center">
                  {likes.length}
                </span>
              </div>
              <div className="flex items-center text-slate-400 border-[1px] border-slate-700  rounded-md bg-slate-800 bg-opacity-80">
                <button
                  className={`px-2 py-[3px]  rounded-l-md transition-all duration-300 ${
                    showComment
                      ? "text-blue-500 bg-slate-700"
                      : "hover:bg-slate-700 hover:text-blue-500"
                  }`}
                  onClick={() => setShowComment((isShown) => !isShown)}
                >
                  {showComment ? <BiSolidComment /> : <BiComment />}
                </button>
                <span className="flex-grow px-2 border-l-[1px] border-slate-700 text-center">
                  {comments.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showComment && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <span className="text-slate-300">Comments</span>
            <button
              className="text-[13px] text-slate-400 bg-slate-900 px-2 rounded-md translate-x-0 duration-300 hover:bg-slate-800 hover:underline-offset-1 flex items-center gap-2"
              onClick={() => setShowComment(false)}
            >
              hide <MdArrowUpward />
            </button>
            <div className="flex-grow h-1 bg-gradient-to-l from-slate-800 to-transparent rounded-full " />
          </div>
          <div className="flex flex-col gap-4">
            {comments.map((comment, i) => (
              <Comment comment={comment} key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function TeamProjects() {
  const { teamData } = useSelector((state) => state.teams);
  const { user, isUserSignedIn } = useSelector((state) => state.auth);
  const { userId } = useParams();

  // const projects = teamData?.projects;
  const projects = [
    {
      _id: "1",
      name: "Project Alpha",
      description: "This is a project for developing an AI-powered chatbot.",
      lngName: "python",
      type: "project",
      likes: [
        { _id: "1", userId: "2" },
        { _id: "2", userId: "3" },
      ],
      comments: [
        {
          _id: "1",
          comment: "This project looks amazing!",
          userId: "2",
          userName: "John Doe",
          userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          _id: "2",
          comment: "I want to contribute to this.",
          userId: "3",
          userName: "Jane Smith",
          userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
      ],
    },
    {
      _id: "2",
      name: "Project Beta",
      description: "A new JavaScript library to enhance web UI components.",
      lngName: "javascript",
      type: "project",
      likes: [
        { _id: "3", userId: "1" },
        { _id: "4", userId: "4" },
      ],
      comments: [
        {
          _id: "3",
          comment: "Great work! Can't wait to see it finished.",
          userId: "1",
          userName: "Michael Feleke",
          userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        },
      ],
    },
    {
      _id: "3",
      name: "Project Gamma",
      description: "Open-source project for creating interactive 3D models.",
      lngName: "typescript",
      type: "project",
      likes: [
        { _id: "5", userId: "1" },
        { _id: "6", userId: "2" },
        { _id: "7", userId: "3" },
      ],
      comments: [
        {
          _id: "4",
          comment: "Excited for this! 3D models are the future.",
          userId: "2",
          userName: "John Doe",
          userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          _id: "5",
          comment: "Would love to help with this project.",
          userId: "3",
          userName: "Jane Smith",
          userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
      ],
    },
    {
      _id: "4",
      name: "Project Delta",
      description:
        "A tool for monitoring and analyzing data streams in real-time.",
      lngName: "go",
      type: "project",
      likes: [
        { _id: "8", userId: "4" },
        { _id: "9", userId: "5" },
      ],
      comments: [
        {
          _id: "6",
          comment: "This is an important tool for data analysts.",
          userId: "4",
          userName: "David Lee",
          userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          _id: "7",
          comment: "I want to see more updates!",
          userId: "5",
          userName: "Laura Chen",
          userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
      ],
    },
  ];

  const isLoggedInUser = isEqual(isUserSignedIn && user.userId, userId);

  return projects?.length > 0 ? (
    <div className="flex flex-col justify-center sd:items-start gap-3 sd:gap-7 px-2 sd:flex-row sd:flex-wrap pb-3">
      {projects.map((project, index) => (
        <Project project={project} key={index} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-3 w-full h-full pb-40">
      {isLoggedInUser ? (
        <>
          <span className="text-slate-300 text-lg">
            Team has no projects yet, create one.
          </span>
          <NavLink
            className="text-slate-300 bg-slate-700 bg-opacity-60 px-4 py-2 rounded-full transition-all duration-300 hover:text-slate-50 hover:bg-opacity-80"
            to={"/editor/dotcode"}
          >
            Open to editor
          </NavLink>
        </>
      ) : (
        <>
          <span className="text-slate-300 font-semibold tracking-wide text-lg">
            Team has no projects yet.
          </span>
          <NavLink
            to={"/community"}
            className="text-slate-400 hover:text-slate-300 hover:underline hover:underline-offset-2"
          >
            check community
          </NavLink>
        </>
      )}
    </div>
  );
}

export default TeamProjects;
