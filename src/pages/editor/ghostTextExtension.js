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

// Create high-precedence keymap for Escape only (Tab is handled in main component)
export const ghostTextKeymap = Prec.highest(
  keymap.of([
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
    ghostTextKeymap,
    EditorView.baseTheme({
      ".cm-ghost-text-widget": {
        color: "grey !important",
        opacity: "0.7",
        fontStyle: "italic",
      },
    }),
  ];
}
