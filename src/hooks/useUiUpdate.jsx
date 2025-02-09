import { useDispatch, useSelector } from "react-redux";
import { updateSelectedLng } from "../pages/editor/projectSlice";

export const useUiUpdate = () => {
  const { latestCode } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const handleSelection = (lngName) => {
    if (lngName === "html") {
      dispatch(updateSelectedLng({ code: latestCode.html, lng: lngName }));
    } else if (lngName === "css") {
      dispatch(updateSelectedLng({ code: latestCode.css, lng: lngName }));
    } else {
      dispatch(updateSelectedLng({ code: latestCode.js, lng: lngName }));
    }
  };

  return handleSelection;
};
