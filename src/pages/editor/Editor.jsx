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
import { inlineChatExtension } from "./inlineChatExtension";
import { setInputText as setChatInputText } from "./features/sidebar/chatSlice";
import { setActiveTab } from "./features/sidebar/sidebarSlice";

const Editor = ({ code }) => {
  const { codeFontSize, codeTabSize, closeBrackets, lineNo, foldGut, holder } =
    useSelector((state) => state.setting);
  const { searchPanel } = useSelector((state) => state.editor);
  const { currLng } = useSelector((state) => state.project);
  const { ghostTextSuggestion, isGhostTextLoading } = useSelector(
    (state) => state.completion,
  );
  const selectedModelForCompletion = useSelector(
    (state) => state.chat.selectedModel,
  );

  const dispatch = useDispatch();
  const tabSize = Array.from({ length: codeTabSize }, () => " ").join("");
  const [editorView, setEditorView] = useState(null);
  const updateCode = useCode();

  const debounceTimerRef = useRef(null);
  const acceptanceTimerRef = useRef(null);
  const justAcceptedTimerRef = useRef(null);
  const cursorPositionRef = useRef(0);
  const lastSuggestionRef = useRef(null);
  const currentLanguageRef = useRef(currLng);
  const justAcceptedRef = useRef(false);
  const isMountedRef = useRef(true);
  const hasGhostTextRef = useRef(false);

  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);

  const mode = getLngInfo(currLng).mode;

  const checkForGhostText = useCallback((view) => {
    if (!view) return false;

    const decorations = view.state.field(ghostTextField);
    let hasGhost = false;

    decorations.between(0, view.state.doc.length, (_from, _to, decoration) => {
      if (decoration.spec.widget instanceof GhostTextWidget) {
        hasGhost = true;
        return false;
      }
    });

    hasGhostTextRef.current = hasGhost;
    return hasGhost;
  }, []);

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

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      hasGhostTextRef.current = false;

      if (editorView && editorView._ghostTextCleanup) {
        editorView._ghostTextCleanup();
      }
    };
  }, [clearAllTimers, editorView]);

  useEffect(() => {
    if (currentLanguageRef.current !== currLng) {
      currentLanguageRef.current = currLng;

      clearAllTimers();

      dispatch(clearGhostText());
      if (editorView) {
        editorView.dispatch({
          effects: clearGhostTextEffect.of(null),
        });
      }

      setAcceptedSuggestion(false);
      lastSuggestionRef.current = null;
      justAcceptedRef.current = false;
      hasGhostTextRef.current = false;
    }

    return () => {};
  }, [currLng, editorView, dispatch, clearAllTimers]);

  const handleChatWithAI = (selectedText) => {
    console.log("EDITOR: handleChatWithAI called.");
    console.log("EDITOR: Current project currLng from selector:", currLng);
    console.log("EDITOR: Selected text:", selectedText);

    if (!selectedText || selectedText.trim() === "") {
      console.warn("EDITOR: No text selected or empty selection.");
      return;
    }

    const prompt = `Explain this code snippet from my ${currLng} file:\n\`\`\`${currLng}\n${selectedText}\n\`\`\``;
    console.log("EDITOR: Dispatching setChatInputText with prompt:", prompt);
    dispatch(setChatInputText(prompt));

    console.log("EDITOR: Dispatching setActiveTab to 'chat'");
    dispatch(setActiveTab({ tab: "chat", title: "AI Assistant" }));
  };

  const handleEditorCreate = (view) => {
    if (!isMountedRef.current) return;

    setEditorView(view);
    cursorPositionRef.current = view.state.selection.main.head;

    const handleKeyDown = (e) => {
      if (!isMountedRef.current) return;

      if (e.key === "Tab") {
        const hasGhost = checkForGhostText(view);

        if (hasGhost) {
          console.log(
            "Tab intercepted - ghost text present, preventing default behavior",
          );

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          const decorations = view.state.field(ghostTextField);
          let ghostText = null;

          decorations.between(
            0,
            view.state.doc.length,
            (from, _to, decoration) => {
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
            console.log("Accepting ghost text:", ghostText.text);

            const endPosition = ghostText.from + ghostText.text.length;

            view.dispatch({
              changes: { from: ghostText.from, insert: ghostText.text },
              selection: { anchor: endPosition, head: endPosition },
              effects: clearGhostTextEffect.of(null),
            });

            const newValue = view.state.doc.toString();
            updateCode(newValue, currLng);
            dispatch(clearGhostText());

            lastSuggestionRef.current = ghostText.text;
            setAcceptedSuggestion(true);
            justAcceptedRef.current = true;
            hasGhostTextRef.current = false;

            cursorPositionRef.current = endPosition;

            clearAllTimers();

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
          }

          return false;
        } else {
          console.log(
            "Tab key pressed but no ghost text - allowing default behavior",
          );
          return true;
        }
      }
    };

    const editorContainer = view.dom;
    const contentContainer = view.contentDOM;

    editorContainer.addEventListener("keydown", handleKeyDown, true);
    contentContainer.addEventListener("keydown", handleKeyDown, true);

    view._ghostTextCleanup = () => {
      editorContainer.removeEventListener("keydown", handleKeyDown, true);
      contentContainer.removeEventListener("keydown", handleKeyDown, true);
    };
  };

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
        hasGhostTextRef.current = true;
      }
    } else if (!ghostTextSuggestion && editorView && isMountedRef.current) {
      editorView.dispatch({
        effects: clearGhostTextEffect.of(null),
      });
      hasGhostTextRef.current = false;
    }
  }, [ghostTextSuggestion, isGhostTextLoading, editorView, acceptedSuggestion]);

  useEffect(() => {
    if (
      !ghostTextSuggestion ||
      isGhostTextLoading ||
      acceptedSuggestion ||
      justAcceptedRef.current
    ) {
      hasGhostTextRef.current = false;
    }
  }, [ghostTextSuggestion, isGhostTextLoading, acceptedSuggestion]);

  const handleChange = (value, viewUpdate) => {
    if (!isMountedRef.current) return;

    updateCode(value, currLng);

    if (viewUpdate && viewUpdate.state) {
      cursorPositionRef.current = viewUpdate.state.selection.main.head;
    }

    if (viewUpdate && viewUpdate.docChanged) {
      const cursor = cursorPositionRef.current;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      dispatch(clearGhostText());
      if (editorView) {
        editorView.dispatch({
          effects: clearGhostTextEffect.of(null),
        });
      }
      hasGhostTextRef.current = false;

      if (!acceptedSuggestion && !justAcceptedRef.current) {
        const isUserTyping = viewUpdate.transactions.some(
          (tr) =>
            tr.isUserEvent("input.type") ||
            tr.isUserEvent("input.paste") ||
            tr.isUserEvent("delete"),
        );

        if (isUserTyping) {
          console.log("User is typing, will request new suggestion");
          justAcceptedRef.current = false;

          debounceTimerRef.current = setTimeout(() => {
            if (!isMountedRef.current) return;

            const context = value.substring(0, cursor);
            if (context.trim().length > 2) {
              dispatch(
                fetchGhostTextRequest({
                  language: currLng,
                  context: context,
                  selectedModel:
                    selectedModelForCompletion || "Gemini 2.0 Flash",
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

      if (Math.abs(newPos - oldPos) > 1) {
        dispatch(clearGhostText());
        if (editorView) {
          editorView.dispatch({
            effects: clearGhostTextEffect.of(null),
          });
        }
        hasGhostTextRef.current = false;
      }
    }

    if (editorView) {
      checkForGhostText(editorView);
    }
  };

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
  }, [searchPanel, editorView]);

  return (
    <div className="relative w-full h-full">
      {/* Loading spinner */}
      {isGhostTextLoading && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-gray-400">
          <CompletionLoader size="w-3 h-3" />
          <span>Generating...</span>
        </div>
      )}

      {ghostTextSuggestion &&
        !isGhostTextLoading &&
        !justAcceptedRef.current &&
        hasGhostTextRef.current && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
              Tab
            </kbd>
            <span>to accept</span>
          </div>
        )}

      <CodeMirror
        key={currLng}
        value={code}
        theme={oneDark}
        extensions={[
          mode,
          EditorView.lineWrapping,
          indentUnit.of(tabSize),
          keymap.of(searchKeymap),
          ghostTextExtension(),
          inlineChatExtension(handleChatWithAI),
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
