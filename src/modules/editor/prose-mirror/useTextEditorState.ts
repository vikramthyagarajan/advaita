import AppStore from "modules/state/AppStore";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { exampleSetup } from "prosemirror-example-setup";
import { defaultMarkdownParser, schema } from "prosemirror-markdown";
import { EditorState } from "prosemirror-state";
import { useState } from "react";

export const useTextEditorState = (id: string) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  const [editorState, setEditorState] = useState(
    EditorState.create({
      doc: defaultMarkdownParser.parse(node.text) || undefined,
      plugins: exampleSetup({ schema }),
    })
  );
  AppStore.editors.addEditor(id, editorState, setEditorState);

  return editorState;
};