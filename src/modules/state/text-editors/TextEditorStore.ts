import { EditorState, Transaction } from "prosemirror-state";
import { Dispatch, SetStateAction } from "react";

export default class TextEditorStore {
  private editors: Map<
    string,
    {
      state: EditorState;
      setState: Dispatch<SetStateAction<EditorState>>;
      view?: HTMLDivElement;
    }
  > = new Map();

  getEditorState(id: string) {
    const editor = this.editors.get(id);
    return editor?.state;
  }

  getEditorView(id: string) {
    const editor = this.editors.get(id);
    return editor?.view;
  }

  addEditor(
    id: string,
    state: EditorState,
    setState: Dispatch<SetStateAction<EditorState>>
  ) {
    const existingEditor = this.editors.get(id);
    if (existingEditor)
      console.warn(
        "Adding an editor that already exists. Might overwrite some data"
      );
    this.editors.set(id, { state, setState });
  }

  updateEditorState(id: string, tr: Transaction) {
    const editor = this.editors.get(id);
    if (!editor) {
      console.error("No editor found. Cannot update state");
      return;
    }

    editor.setState((s) => {
      const newState = s.apply(tr);
      this.editors.set(id, { ...editor, state: newState });
      return newState;
    });
  }
}
