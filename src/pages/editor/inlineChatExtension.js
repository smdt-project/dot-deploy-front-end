import { EditorView, Decoration } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { WidgetType } from "@codemirror/view";

export const showChatButtonEffect = StateEffect.define();
export const hideChatButtonEffect = StateEffect.define();

class ChatButtonWidget extends WidgetType {
  constructor(onChatWithAIClick) {
    super();
    this.onChatWithAIClick = onChatWithAIClick;
    console.log("INLINE CHAT WIDGET: Constructor called");
  }

  toDOM(view) {
    console.log("INLINE CHAT WIDGET: toDOM called");
    const button = document.createElement("button");
    button.textContent = "Chat with AI";
    button.className =
      "cm-inline-chat-button bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg absolute z-50";
    button.style.cursor = "pointer";
    button.style.top = "10px";
    button.style.right = "10px";

    button.onclick = (event) => {
      console.log("INLINE CHAT WIDGET: Button clicked");
      event.stopPropagation();
      const selection = view.state.selection.main;
      const selectedText = view.state.doc.sliceString(
        selection.from,
        selection.to,
      );
      this.onChatWithAIClick(selectedText);
      view.dispatch({ effects: hideChatButtonEffect.of(null) });
    };
    return button;
  }

  eq(other) {
    return other instanceof ChatButtonWidget;
  }

  ignoreEvent() {
    return false;
  }
}

export const inlineChatButtonState = StateField.define({
  create() {
    console.log("INLINE CHAT STATE: create");
    return Decoration.none;
  },
  update(decorations, tr) {
    console.log("INLINE CHAT STATE: update triggered");
    if (
      tr.docChanged ||
      (tr.selection &&
        tr.selection.main.empty &&
        !tr.effects.some((e) => e.is(showChatButtonEffect)))
    ) {
      console.log(
        "INLINE CHAT STATE: Hiding due to docChange or empty selection without show effect",
      );
      return Decoration.none;
    }

    for (let effect of tr.effects) {
      if (effect.is(showChatButtonEffect)) {
        const { to, onChatWithAIClick } = effect.value;
        console.log(
          "INLINE CHAT STATE: showChatButtonEffect received, creating widget at",
          to,
        );
        return Decoration.set([
          Decoration.widget({
            widget: new ChatButtonWidget(onChatWithAIClick),
            side: 1,
          }).range(to),
        ]);
      }
      if (effect.is(hideChatButtonEffect)) {
        console.log("INLINE CHAT STATE: hideChatButtonEffect received");
        return Decoration.none;
      }
    }
    return decorations.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function inlineChatExtension(onChatWithAIClick) {
  console.log(
    "INLINE CHAT EXTENSION: Initializing with onChatWithAIClick callback",
  );
  return [
    inlineChatButtonState,
    EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        console.log("INLINE CHAT LISTENER: selectionSet detected");
        const selection = update.state.selection.main;
        if (!selection.empty) {
          console.log(
            "INLINE CHAT LISTENER: Selection is not empty, dispatching show effect",
            selection.from,
            selection.to,
          );
          update.view.dispatch({
            effects: showChatButtonEffect.of({
              from: selection.from,
              to: selection.to,
              onChatWithAIClick,
            }),
          });
        } else {
          console.log(
            "INLINE CHAT LISTENER: Selection is empty, dispatching hide effect",
          );
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
    EditorView.baseTheme({
      ".cm-inline-chat-button": {
        border: "2px solid red !important",
      },
    }),
  ];
}
