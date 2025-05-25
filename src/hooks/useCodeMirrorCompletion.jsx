import { EditorView } from "@codemirror/view";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useCodeMirrorCompletion(view) {
  const dispatch = useDispatch();
  const { ghostTextSuggestion, isGhostTextLoading } = useSelector(
    (state) => state.completion,
  );
  const { selectedLng } = useSelector((state) => state.project);
  const cursorPositionRef = useRef(null);

  useEffect(() => {
    if (!view) return;
    const updateCursorPosition = () => {
      const selection = view.state.selection.main;
      cursorPositionRef.current = selection.head;
    };

    updateCursorPosition();

    const listener = EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        updateCursorPosition();

        if (ghostTextSuggestion) {
          dispatch(clearReduxGhostText());
          view.dispatch({
            effects: clearGhostText.of(null),
          });
        }
      }
    });

    view.dispatch({ effects: listener });

    return () => {};
  }, [view, dispatch, ghostTextSuggestion]);

  useEffect(() => {
    if (!view) return;

    const debouncedFetchSuggestions = debounce(() => {
      if (!cursorPositionRef.current) return;

      const doc = view.state.doc;
      const cursorPos = cursorPositionRef.current;
      const context = doc.sliceString(0, cursorPos);

      if (context.trim().length > 3) {
        dispatch(
          fetchGhostTextRequest({
            language: selectedLng,
            context: context,
          }),
        );
      }
    }, 500);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        debouncedFetchSuggestions();
      }
    });

    view.dispatch({ effects: updateListener });

    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [view, dispatch, selectedLng]);

  useEffect(() => {
    if (!view || !ghostTextSuggestion || !cursorPositionRef.current) return;

    view.dispatch({
      effects: setGhostText.of({
        from: cursorPositionRef.current,
        text: ghostTextSuggestion,
      }),
    });
  }, [view, ghostTextSuggestion]);

  return {
    isLoading: isGhostTextLoading,
  };
}
