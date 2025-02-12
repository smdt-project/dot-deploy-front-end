import { useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { GoDot } from "react-icons/go";
import { BiRefresh } from "react-icons/bi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../features/auth/authData";
import {
  setLatestCode,
  toggleCommitting,
  updateProjectRequest
} from "./projectSlice";
import { CgClose } from "react-icons/cg";

const Generating = () => {
  useGSAP(() => {
    gsap.to(".loadingDot", {
      y: 10,
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
      duration: 0.2,
      ease: "power1.inOut"
    });
  });

  return (
    <div className="flex items-center text-color-5 pb-1">
      <div className="loadingDot">
        <GoDot size={15} />
      </div>
      <div className="loadingDot">
        <GoDot size={15} />
      </div>
      <div className="loadingDot">
        <GoDot size={15} />
      </div>
    </div>
  );
};

const CommitBox = () => {
  const { project, latestCode, currCode } = useSelector(
    (state) => state.project
  );

  const [commit, setCommit] = useState("");
  const [emptyErr, setEmptyErr] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const submitCommit = () => {
    if (commit.trim().length > 0) {
      dispatch(
        setLatestCode({
          ...latestCode,
          commitMsg: commit
        })
      );
      dispatch(toggleCommitting(false));

      const committedCode = { ...latestCode, commitMsg: commit };
      dispatch(
        updateProjectRequest({
          _id: project._id,
          code:
            project.type === "snippet"
              ? { ...committedCode, code: currCode }
              : committedCode
        })
      );
    } else {
      setEmptyErr("Commit Message Can't be empity!");
    }
  };

  const generateMsg = async () => {
    try {
      const token = getUserData(true);
      setIsGenerating(true);
      setError("");

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/projects/suggest/${
          project.id
        }`,
        { code: latestCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setCommit(response.data.data);
    } catch (error) {
      setError("Unable to generate commit message");
    } finally {
      setIsGenerating(false);
    }
  };

  const tryAgain = (event) => {
    event.stopPropagation();
    generateMsg();
  };

  const cancelCommiting = () => {
    dispatch(toggleCommitting(false));
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-10 z-[100] flex flex-col gap-2 w-[35rem] p-3  m-5 rounded-lg border-[1px] border-slate-700 overflow-hidden shadow-lg bg-n-14 shadow-n-13">
      <div className="flex items-center gap-3 flex-grow">
        <div className="flex items-center justify-between flex-grow">
          <span className="text-color-5">Add Commit Message </span>
          <button
            className="text-n-2 text-lg transition-all duration-300 hover:text-n-1"
            onClick={() => cancelCommiting()}
          >
            <CgClose />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 py-[6px] px-2 bg-n-13/30 rounded-md">
        <input
          autoFocus
          type="text"
          value={commit}
          onChange={(e) => {
            if (emptyErr) {
              setEmptyErr("");
            }
            setCommit(e.target.value);
          }}
          placeholder={`${emptyErr ? emptyErr : "Commit Message"}`}
          className={`flex flex-grow bg-transparent outline-none border-none ${
            emptyErr ? "placeholder:text-red-500" : ""
          } placeholder:text-sm`}
        />
        <button
          onClick={() => submitCommit()}
          className="text-n-2 text-sm bg-n-13/50 px-2 py-1 rounded-md transition-all duration-300 hover:bg-n-13/100 hover:text-n-1"
        >
          <span>Commit & Save</span>
        </button>
      </div>
      <div className="flex-grow h-[1px] bg-slate-700 w-full" />
      <button
        className="flex gap-3 items-center justify-between rounded-md hover:bg-n-13/100 hover:text-n-1 p-2 transition-all duration-300 bg-n-13/30 text-n-2"
        onClick={() => generateMsg()}
      >
        <div className="flex items-center gap-3 flex-grow">
          <img
            src="/dot.svg"
            alt=""
            width={20}
            className={`${error ? "" : ""}`}
          />
          {!error ? (
            <span>{isGenerating ? "Generating ... " : "Generate with AI"}</span>
          ) : (
            <div className="flex items-center justify-between flex-grow">
              <span className="text-red-500">{error}</span>
              <button
                className="text-n-2 text-lg transition-all duration-300 hover:text-n-1"
                onClick={(event) => tryAgain(event)}
              >
                <BiRefresh />
              </button>
            </div>
          )}
        </div>
        {isGenerating && <Generating />}
      </button>
    </div>
  );
};

export default CommitBox;
