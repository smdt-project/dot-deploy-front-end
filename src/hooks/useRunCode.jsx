import { useDispatch, useSelector } from "react-redux";
import { runSnippetRequest } from "../pages/editor/projectSlice";
import { supportedLng } from "../utils/supportedLng";
import { setNotifier } from "../ui/notifierSlice";

export const useRunCode = () => {
  const { project, currLng, currCode, isRunning } = useSelector(
    (state) => state.project
  );

  const dispatch = useDispatch();

  const runcode = () => {
    if (!currCode) {
      dispatch(
        setNotifier({ error: `No ${project.lngName} code is written to run!` })
      );
    } else {
      if (isRunning) {
        dispatch(
          setNotifier({ error: `${project.lngName} Code is already running!` })
        );
      } else {
        const lgnDetail = supportedLng.filter(
          (lng) => lng.lngName === currLng
        )[0];
        if (lgnDetail.id === -4) {
          dispatch(
            setNotifier({
              error: `${project.lngName} cannot be run alone as snippet, create ui component instead!`
            })
          );
        } else {
          dispatch(
            runSnippetRequest({
              code: currCode,
              lng_id: lgnDetail.id,
              stdin: ""
            })
          );
        }
      }
    }
  };

  return runcode;
};
