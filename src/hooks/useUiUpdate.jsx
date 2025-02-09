import { useDispatch, useSelector } from "react-redux";
import { updateSelectedLng } from "../pages/editor/projectSlice";

export const useUiUpdate = () => {
  const { project, selectedVersion } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const handleSelection = (lngName) => {
    console.log(project.code, selectedVersion, lngName);
    if (lngName === "html") {
      dispatch(
        updateSelectedLng({
          code: project.code[selectedVersion - 1].html,
          lng: lngName,
        }),
      );
    } else if (lngName === "css") {
      dispatch(
        updateSelectedLng({
          code: project.code[selectedVersion - 1].css,
          lng: lngName,
        }),
      );
    } else {
      dispatch(
        updateSelectedLng({
          code: project.code[selectedVersion - 1].js,
          lng: lngName,
        }),
      );
    }
  };

  return handleSelection;
};
