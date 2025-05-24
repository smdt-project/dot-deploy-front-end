import { indentUnit } from "@codemirror/language";
import { searchKeymap } from "@codemirror/search";
import CodeMirror, { EditorView, keymap, oneDark } from "@uiw/react-codemirror";
import { useEffect, useRef, useState, useCallback } from "react";
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
import CompletionLoader from "../../ui/CompletionLoader";

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

  // Refs for cleanup
  const debounceTimerRef = useRef(null);
  const acceptanceTimerRef = useRef(null);
  const justAcceptedTimerRef = useRef(null);
  const cursorPositionRef = useRef(0);
  const lastSuggestionRef = useRef(null);
  const currentLanguageRef = useRef(currLng);
  const justAcceptedRef = useRef(false);
  const isMountedRef = useRef(true);

  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);

  const mode = getLngInfo(currLng).mode;

  // Cleanup function for all timers
  const clearAllTimers = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (acceptanceTimerRef.current) {
      clearTimeout(acceptanceTimerRef.current);
      acceptanceTimerRef.current = null;
    }
    if (justAcceptedTimerRef.current) {
      clearTimeout(justAcceptedTimerRef.current);
      justAcceptedTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearAllTimers();

      // Cleanup editor event listeners
      if (editorView && editorView._ghostTextCleanup) {
        editorView._ghostTextCleanup();
      }
    };
  }, [clearAllTimers, editorView]);

  // Language change effect with proper cleanup
  useEffect(() => {
    if (currentLanguageRef.current !== currLng) {
      currentLanguageRef.current = currLng;

      // Clear all timers when language changes
      clearAllTimers();

      dispatch(clearGhostText());
      if (editorView) {
        editorView.dispatch({
          effects: clearGhostTextEffect.of(null),
        });
      }

      // Reset all state
      setAcceptedSuggestion(false);
      lastSuggestionRef.current = null;
      justAcceptedRef.current = false;
    }

    // Cleanup function for this effect
    return () => {
      // Any specific cleanup for language change can go here
    };
  }, [currLng, editorView, dispatch, clearAllTimers]);

  const handleEditorCreate = (view) => {
    if (!isMountedRef.current) return;

    setEditorView(view);
    cursorPositionRef.current = view.state.selection.main.head;

    // Add high-priority DOM event listener for Tab
    const handleKeyDown = (e) => {
      if (!isMountedRef.current) return;

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

          // Clear existing timers before setting new ones
          clearAllTimers();

          // Reset the flags after a delay
          acceptanceTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setAcceptedSuggestion(false);
            }
          }, 3000);

          justAcceptedTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              justAcceptedRef.current = false;
            }
          }, 1000);

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

  // Ghost text suggestion effect with proper cleanup
  useEffect(() => {
    if (
      editorView &&
      ghostTextSuggestion &&
      !isGhostTextLoading &&
      !acceptedSuggestion &&
      !justAcceptedRef.current &&
      isMountedRef.current
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
    } else if (!ghostTextSuggestion && editorView && isMountedRef.current) {
      editorView.dispatch({
        effects: clearGhostTextEffect.of(null),
      });
    }

    // No cleanup needed for this effect as it's purely reactive
  }, [ghostTextSuggestion, isGhostTextLoading, editorView, acceptedSuggestion]);

  const handleChange = (value, viewUpdate) => {
    if (!isMountedRef.current) return;

    updateCode(value, currLng);

    if (viewUpdate && viewUpdate.state) {
      cursorPositionRef.current = viewUpdate.state.selection.main.head;
    }

    if (viewUpdate && viewUpdate.docChanged) {
      const cursor = cursorPositionRef.current;

      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
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
            if (!isMountedRef.current) return;

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
    if (!isMountedRef.current) return;

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

  // Search panel effect with proper cleanup
  useEffect(() => {
    if (editorView && searchPanel && isMountedRef.current) {
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

    // No cleanup needed for this effect
  }, [searchPanel, editorView]);

  return (
    <div className="relative w-full h-full">
      {/* Loading spinner instead of "Thinking..." */}
      {isGhostTextLoading && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-gray-400">
          <CompletionLoader size="w-3 h-3" />
          <span>Generating...</span>
        </div>
      )}

      {/* Ghost text suggestion indicator */}
      {ghostTextSuggestion && !justAcceptedRef.current && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-gray-400">
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
            Tab
          </kbd>
          <span>to accept</span>
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
