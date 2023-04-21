import { useEffect, useState } from "react";
import { TextSelection } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import AppStore from "modules/state/AppStore";
import SelectionActions from "./SelectionActions";
import { useTextEditorState } from "./useTextEditorState";

const ProseMirrorEditor = ({ node }: { node: TextboxNode }) => {
  const [mount, setMount] = useState<HTMLDivElement | null>(null);
  const editorState = useTextEditorState(node.id);

  useEffect(() => {
    const tr = editorState.tr;
    tr.setSelection(
      new TextSelection(tr.doc.resolve(0), tr.doc.resolve(tr.doc.content.size))
    );
    const textNode = defaultMarkdownParser.parse(node.text);
    if (textNode) tr.replaceSelectionWith(textNode);
    AppStore.editors.updateEditorState(node.id, tr);
  }, [node.text]);

  return (
    <ProseMirror
      mount={mount}
      state={editorState}
      dispatchTransaction={(tr) =>
        AppStore.editors.updateEditorState(node.id, tr)
      }
    >
      <SelectionActions node={node} />
      <div
        ref={setMount}
        onBlur={() => {
          const text = defaultMarkdownSerializer.serialize(editorState.doc);
          AppStore.project.setNode(node.id, { text });
        }}
      />
    </ProseMirror>
  );
};

export default ProseMirrorEditor;
