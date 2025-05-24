import { indentUnit } from "@codemirror/language";
import { searchKeymap } from "@codemirror/search";
import CodeMirror, { EditorView, keymap, oneDark } from "@uiw/react-codemirror";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCode } from "../../hooks/useCode";
import { getLngInfo } from "../../utils/helpers";
import { clearGhostText, fetchGhostTextRequest } from "./completionSlice";
import {
  ghostTextExtension,
  setGhostText,
  clearGhostText as clearGhostTextEffect,
  ghostTextField,
  GhostTextWidget,
} from "./ghostTextExtension";

const Editor = ({ code }) => {
  const { codeFontSize, codeTabSize, closeBrackets, lineNo, foldGut, holder } =
    useSelector((state) => state.setting);
  const { searchPanel } = useSelector((state) => state.editor);
  const { currLng } = useSelector((state) => state.project);
  const { ghostTextSuggestion, isGhostTextLoading } = useSelector(
    (state) => state.completion,
  );

  const dispatch = useDispatch();
  const tabSize = Array.from({ length: codeTabSize }, () => " ").join("");
  const [editorView, setEditorView] = useState(null);
  const updateCode = useCode();
  const debounceTimerRef = useRef(null);
  const cursorPositionRef = useRef(0);
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);
  const lastSuggestionRef = useRef(null);
  const currentLanguageRef = useRef(currLng);
  const justAcceptedRef = useRef(false); // Track if we just accepted a suggestion

  const mode = getLngInfo(currLng).mode;

  useEffect(() => {
    if (currentLanguageRef.current !== currLng) {
      currentLanguageRef.current = currLng;
      dispatch(clearGhostText());
      if (editorView) {
        editorView.dispatch({
          effects: clearGhostTextEffect.of(null),
        });
      }
      setAcceptedSuggestion(false);
      lastSuggestionRef.current = null;
      justAcceptedRef.current = false;
    }
  }, [currLng, editorView, dispatch]);

  const handleEditorCreate = (view) => {
    setEditorView(view);
    cursorPositionRef.current = view.state.selection.main.head;

    // Add high-priority DOM event listener for Tab
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        console.log("DOM Tab event intercepted");

        // Check for ghost text
        const decorations = view.state.field(ghostTextField);
        let ghostText = null;

        decorations.between(
          0,
          view.state.doc.length,
          (from, to, decoration) => {
            if (decoration.spec.widget instanceof GhostTextWidget) {
              ghostText = {
                from,
                text: decoration.spec.widget.text,
              };
              return false;
            }
          },
        );

        if (ghostText) {
          console.log("Accepting ghost text via DOM handler:", ghostText.text);

          // Prevent default behavior
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Calculate the end position
          const endPosition = ghostText.from + ghostText.text.length;

          // Accept the suggestion and move cursor to end
          view.dispatch({
            changes: { from: ghostText.from, insert: ghostText.text },
            selection: { anchor: endPosition, head: endPosition },
            effects: clearGhostTextEffect.of(null),
          });

          // Update Redux state
          const newValue = view.state.doc.toString();
          updateCode(newValue, currLng);
          dispatch(clearGhostText());

          // Track the accepted suggestion and prevent immediate re-suggestion
          lastSuggestionRef.current = ghostText.text;
          setAcceptedSuggestion(true);
          justAcceptedRef.current = true;

          // Update cursor position ref
          cursorPositionRef.current = endPosition;

          // Reset the flags after a delay
          setTimeout(() => {
            setAcceptedSuggestion(false);
          }, 3000);

          setTimeout(() => {
            justAcceptedRef.current = false;
          }, 1000); // Shorter delay for this flag

          return false;
        }
      }
    };

    // Add to both the view's DOM and content DOM with capture
    view.dom.addEventListener("keydown", handleKeyDown, true);
    view.contentDOM.addEventListener("keydown", handleKeyDown, true);

    // Store the cleanup function
    view._ghostTextCleanup = () => {
      view.dom.removeEventListener("keydown", handleKeyDown, true);
      view.contentDOM.removeEventListener("keydown", handleKeyDown, true);
    };
  };

  // Cleanup event listeners when component unmounts
  useEffect(() => {
    return () => {
      if (editorView && editorView._ghostTextCleanup) {
        editorView._ghostTextCleanup();
      }
    };
  }, [editorView]);

  useEffect(() => {
    if (
      editorView &&
      ghostTextSuggestion &&
      !isGhostTextLoading &&
      !acceptedSuggestion &&
      !justAcceptedRef.current // Don't show suggestions immediately after acceptance
    ) {
      console.log("Received suggestion:", ghostTextSuggestion);

      const cleanedSuggestion = ghostTextSuggestion.trim();

      if (cleanedSuggestion === lastSuggestionRef.current) {
        console.log("Skipping duplicate suggestion");
        return;
      }

      console.log("Using suggestion:", cleanedSuggestion);

      if (cleanedSuggestion.length > 0) {
        const cursor = cursorPositionRef.current;
        editorView.dispatch({
          effects: setGhostText.of({
            from: cursor,
            text: cleanedSuggestion,
          }),
        });
      }
    } else if (!ghostTextSuggestion) {
      if (editorView) {
        editorView.dispatch({
          effects: clearGhostTextEffect.of(null),
        });
      }
    }
  }, [ghostTextSuggestion, isGhostTextLoading, editorView, acceptedSuggestion]);

  const handleChange = (value, viewUpdate) => {
    updateCode(value, currLng);

    if (viewUpdate && viewUpdate.state) {
      cursorPositionRef.current = viewUpdate.state.selection.main.head;
    }

    if (viewUpdate && viewUpdate.docChanged) {
      const cursor = cursorPositionRef.current;

      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Clear ghost text when user types
      dispatch(clearGhostText());
      if (editorView) {
        editorView.dispatch({
          effects: clearGhostTextEffect.of(null),
        });
      }

      // Only request new suggestions if we haven't just accepted one and user is actually typing
      if (!acceptedSuggestion && !justAcceptedRef.current) {
        // Check if this is a user-initiated change (not just cursor movement)
        const isUserTyping = viewUpdate.transactions.some(
          (tr) =>
            tr.isUserEvent("input.type") ||
            tr.isUserEvent("input.paste") ||
            tr.isUserEvent("delete"),
        );

        if (isUserTyping) {
          console.log("User is typing, will request new suggestion");
          justAcceptedRef.current = false; // Reset the flag when user starts typing

          debounceTimerRef.current = setTimeout(() => {
            const context = value.substring(0, cursor);
            if (context.trim().length > 2) {
              dispatch(
                fetchGhostTextRequest({
                  language: currLng,
                  context: context,
                  selectedModel: "Gemini 2.0 Flash",
                }),
              );
            }
          }, 700);
        }
      }
    }
  };

  const handleEditorUpdate = (viewUpdate) => {
    if (viewUpdate.selectionSet && !justAcceptedRef.current) {
      const newPos = viewUpdate.state.selection.main.head;
      const oldPos = cursorPositionRef.current;
      cursorPositionRef.current = newPos;

      // Clear ghost text on significant cursor movement (but not right after acceptance)
      if (Math.abs(newPos - oldPos) > 1) {
        dispatch(clearGhostText());
        if (editorView) {
          editorView.dispatch({
            effects: clearGhostTextEffect.of(null),
          });
        }
      }
    }
  };

  useEffect(() => {
    if (editorView) {
      if (searchPanel) {
        editorView.focus();
        const fEvent = new KeyboardEvent("keydown", {
          key: "f",
          code: "KeyF",
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        });
        editorView.contentDOM.dispatchEvent(fEvent);
      }
    }
  }, [searchPanel, editorView]);

  return (
    <div className="relative w-full h-full">
      {isGhostTextLoading && (
        <div className="absolute top-2 right-2 z-10 text-xs text-gray-400">
          Thinking...
        </div>
      )}

      {ghostTextSuggestion && !justAcceptedRef.current && (
        <div className="absolute top-2 right-2 z-10 text-xs text-gray-400">
          Press Tab to accept
        </div>
      )}

      <CodeMirror
        value={code}
        theme={oneDark}
        extensions={[
          mode,
          EditorView.lineWrapping,
          indentUnit.of(tabSize),
          keymap.of(searchKeymap),
          ghostTextExtension(),
        ]}
        placeholder={holder}
        basicSetup={{
          foldGutter: foldGut,
          lineNumbers: lineNo,
          tabSize: codeTabSize,
          mode: mode,
          syntaxHighlighting: true,
          closeBrackets: closeBrackets,
        }}
        style={{
          fontSize: `${codeFontSize}px`,
          paddingLeft: "1.25rem",
          paddingBottom: "2rem",
          height: "100%",
          width: "100%",
        }}
        className="overflow-y-scroll overflow-x-hidden code-scroll"
        onChange={handleChange}
        onCreateEditor={handleEditorCreate}
        onUpdate={handleEditorUpdate}
      />
    </div>
  );
};

export default Editor;
