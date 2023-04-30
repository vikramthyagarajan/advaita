import AppStore from "modules/state/AppStore";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { exampleSetup } from "prosemirror-example-setup";
import { defaultMarkdownParser, schema } from "prosemirror-markdown";
import { EditorState } from "prosemirror-state";
import { useEffect, useState } from "react";

export const useTextEditorState = (id: string) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  const user = AppStore.project.user;
  const [editorState, setEditorState] = useState(
    EditorState.create({
      doc: defaultMarkdownParser.parse(node.text) || undefined,
      plugins: exampleSetup({
        schema,
        menuBar: node.author === (user?.uuid || ""),
      }),
    })
  );
  useEffect(() => {
    AppStore.editors.addEditor(id, editorState, setEditorState);
  }, []);

  return editorState;
};
