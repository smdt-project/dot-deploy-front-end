import { EditorView, Decoration } from "@codemirror/view";
import { StateField, StateEffect, Prec } from "@codemirror/state";
import { WidgetType } from "@codemirror/view";
import { keymap } from "@codemirror/view";

// Define the effects
export const setGhostText = StateEffect.define();
export const clearGhostText = StateEffect.define();

export class GhostTextWidget extends WidgetType {
  constructor(text) {
    super();
    this.text = text;
  }

  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.color = "grey";
    span.style.opacity = "0.7";
    span.style.fontStyle = "italic";
    span.className = "cm-ghost-text-widget";
    return span;
  }

  eq(other) {
    return other instanceof GhostTextWidget && other.text === this.text;
  }
}

export const ghostTextField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    if (tr.docChanged) {
      return Decoration.none;
    }

    for (let effect of tr.effects) {
      if (effect.is(clearGhostText)) {
        return Decoration.none;
      } else if (effect.is(setGhostText)) {
        const { from, text } = effect.value;
        if (!text || text.trim().length === 0) {
          return Decoration.none;
        }

        return Decoration.set([
          Decoration.widget({
            widget: new GhostTextWidget(text),
            side: 1,
            block: false,
          }).range(from),
        ]);
      }
    }

    return decorations.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});

// Create high-precedence keymap that runs BEFORE CodeMirror's built-in Tab handler
export const ghostTextKeymap = Prec.highest(
  keymap.of([
    {
      key: "Tab",
      preventDefault: true,
      stopPropagation: true,
      run: (view) => {
        console.log("High precedence Tab handler running");

        const decorations = view.state.field(ghostTextField);
        let ghostText = null;

        decorations.between(
          0,
          view.state.doc.length,
          (from, to, decoration) => {
            console.log("Checking decoration:", decoration);
            if (decoration.spec.widget instanceof GhostTextWidget) {
              ghostText = {
                from,
                text: decoration.spec.widget.text,
              };
              console.log("Found ghost text:", ghostText);
              return false; // Stop iteration
            }
          },
        );

        if (!ghostText) {
          console.log("No ghost text found, allowing default Tab");
          return false; // Allow default tab behavior
        }

        console.log("Accepting ghost text:", ghostText.text);

        // Calculate the end position after inserting the text
        const endPosition = ghostText.from + ghostText.text.length;

        // Accept the suggestion and move cursor to the end
        view.dispatch({
          changes: { from: ghostText.from, insert: ghostText.text },
          selection: { anchor: endPosition, head: endPosition }, // Move cursor to end
          effects: clearGhostText.of(null),
        });

        return true; // Prevent default tab behavior
      },
    },
    {
      key: "Escape",
      run: (view) => {
        console.log("Escape pressed");
        const decorations = view.state.field(ghostTextField);

        let hasGhostText = false;
        decorations.between(0, view.state.doc.length, () => {
          hasGhostText = true;
          return false;
        });

        if (!hasGhostText) return false;

        view.dispatch({
          effects: clearGhostText.of(null),
        });

        return true;
      },
    },
  ]),
);

export function ghostTextExtension() {
  return [
    ghostTextField,
    ghostTextKeymap, // This now has highest precedence
    EditorView.baseTheme({
      ".cm-ghost-text-widget": {
        color: "grey !important",
        opacity: "0.7",
        fontStyle: "italic",
      },
    }),
  ];
}
