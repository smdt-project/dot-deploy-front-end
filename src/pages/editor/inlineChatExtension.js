import { EditorView, Decoration } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { WidgetType } from "@codemirror/view";

export const showChatButtonEffect = StateEffect.define();
export const hideChatButtonEffect = StateEffect.define();

class ChatButtonWidget extends WidgetType {
  constructor(onChatWithAIClick) {
    super();
    this.onChatWithAIClick = onChatWithAIClick;
    //console.log("🏗️ INLINE CHAT WIDGET: Constructor called");
  }

  toDOM(view) {
    //console.log("🎨 INLINE CHAT WIDGET: toDOM called - Creating button!");

    const container = document.createElement("div");
    container.className = "cm-chat-button-container";

    // ✅ Position relative to the VIEWPORT, not the text position
    container.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    pointer-events: auto;
  `;

    const button = document.createElement("button");
    button.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C7.03 3 3 6.73 3 11.5C3 13.83 4.17 15.9 6 17.24V21L9.76 19.12C10.46 19.24 11.22 19.3 12 19.3C16.97 19.3 21 15.57 21 10.8C21 6.03 16.97 2.3 12 2.3V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="11" r="1" fill="currentColor"/>
      <circle cx="12" cy="11" r="1" fill="currentColor"/>
      <circle cx="15" cy="11" r="1" fill="currentColor"/>
    </svg>
    <span>Chat with AI</span>
  `;

    button.className = "cm-inline-chat-button";
    button.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
  `;

    // Rest of your event handlers...
    const handleAction = (event) => {
      //console.log("🎯 BUTTON ACTION: Event triggered!", event.type);

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const selection = view.state.selection.main;
      const selectedText = view.state.doc.sliceString(
        selection.from,
        selection.to,
      );

      //console.log("📝 SELECTED TEXT:", selectedText);

      if (typeof this.onChatWithAIClick === "function") {
        //console.log("✅ CALLING onChatWithAIClick...");
        try {
          this.onChatWithAIClick(selectedText);
          // console.log("✅ onChatWithAIClick called successfully!");
        } catch (error) {
          console.error("❌ Error in onChatWithAIClick:", error);
        }
      }

      view.dispatch({ effects: hideChatButtonEffect.of(null) });
      return false;
    };

    button.addEventListener("mousedown", handleAction, true);

    // Hover effects
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
      button.style.boxShadow =
        "0 8px 20px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)";
      button.style.background =
        "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow =
        "0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)";
      button.style.background =
        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
    });

    container.appendChild(button);
    return container;
  }

  eq(other) {
    return false; // ✅ Always recreate the widget to ensure toDOM is called
  }

  ignoreEvent() {
    return false;
  }
}

export const inlineChatButtonState = StateField.define({
  create() {
    // console.log("INLINE CHAT STATE: create");
    return Decoration.none;
  },
  update(decorations, tr) {
    // console.log("INLINE CHAT STATE: update triggered");
    if (
      tr.docChanged ||
      (tr.selection &&
        tr.selection.main.empty &&
        !tr.effects.some((e) => e.is(showChatButtonEffect)))
    ) {
      // console.log(
      //   "INLINE CHAT STATE: Hiding due to docChange or empty selection without show effect",
      // );
      return Decoration.none;
    }

    for (let effect of tr.effects) {
      if (effect.is(showChatButtonEffect)) {
        const { to, onChatWithAIClick } = effect.value;
        // console.log(
        //   "INLINE CHAT STATE: showChatButtonEffect received, creating widget at",
        //   to,
        // );
        return Decoration.set([
          Decoration.widget({
            widget: new ChatButtonWidget(onChatWithAIClick),
            side: 1,
          }).range(to),
        ]);
      }
      if (effect.is(hideChatButtonEffect)) {
        // console.log("INLINE CHAT STATE: hideChatButtonEffect received");
        return Decoration.none;
      }
    }
    return decorations.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function inlineChatExtension(onChatWithAIClick) {
  // console.log("🏗️ INLINE CHAT EXTENSION: Initializing...");
  //console.log(
  //  "🔧 INLINE CHAT EXTENSION: onChatWithAIClick received:",
  //  onChatWithAIClick,
  //);
  //console.log(
  //  "🔧 INLINE CHAT EXTENSION: onChatWithAIClick type:",
  //  typeof onChatWithAIClick,
  //);

  return [
    inlineChatButtonState,
    EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        //console.log("INLINE CHAT LISTENER: selectionSet detected");
        const selection = update.state.selection.main;
        if (!selection.empty) {
          //console.log(
          //  "INLINE CHAT LISTENER: Selection is not empty, dispatching show effect",
          //  selection.from,
          //  selection.to,
          //);
          update.view.dispatch({
            effects: showChatButtonEffect.of({
              from: selection.from,
              to: selection.to,
              onChatWithAIClick,
            }),
          });
        } else {
          //console.log(
          //  "INLINE CHAT LISTENER: Selection is empty, dispatching hide effect",
          //);
          if (
            !update.transactions.some((tr) =>
              tr.effects.some((e) => e.is(showChatButtonEffect)),
            )
          ) {
            update.view.dispatch({
              effects: hideChatButtonEffect.of(null),
            });
          }
        }
      }
    }),
  ];
}
