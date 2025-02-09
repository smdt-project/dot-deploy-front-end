import { useDispatch, useSelector } from "react-redux";

import {
  updateCSS,
  updateHTML,
  updateJS,
  updateSelectedLng,
  updateSnippetCode,
} from "../pages/editor/projectSlice";

export const useCode = () => {
  const { project, selectedVersion } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const isSnippet = project.type === "snippet";

  const updateCode = (value, lng) => {
    const latestVersion = project.code[selectedVersion - 1];
    const updatedVersion = {
      ...latestVersion,
      [lng]: value,
    };
    const updatedCodeArray = [updatedVersion, ...project.code.slice(1)];
    if (isSnippet) {
      dispatch(updateSnippetCode(updatedCodeArray));
      dispatch(updateSelectedLng({ code: value, lng: lng }));
    } else {
      if (lng === "html") {
        dispatch(updateHTML(updatedCodeArray));
        dispatch(
          updateSelectedLng({
            code: value,
            lng: "html",
          }),
        );
      } else if (lng === "css") {
        dispatch(updateCSS(updatedCodeArray));
        dispatch(
          updateSelectedLng({
            code: value,
            lng: "css",
          }),
        );
      } else {
        dispatch(updateJS(updatedCodeArray));
        dispatch(
          updateSelectedLng({
            code: value[selectedVersion - 1],
            lng: "js",
          }),
        );
      }
    }
  };

  return updateCode;
};
