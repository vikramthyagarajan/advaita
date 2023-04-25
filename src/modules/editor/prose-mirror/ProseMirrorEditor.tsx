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
import Markdown from "markdown-to-jsx";
import { TextboxMenu } from "./TextboxMenu";
import { syncNodeWithEditorValue } from "./SlateUtils";

const ProseMirrorEditor = ({ node }: { node: TextboxNode }) => {
  const [mount, setMount] = useState<HTMLDivElement | null>(null);
  const preText = node.preText;
  const postText = node.postText;
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
    <>
      <ProseMirror
        mount={mount}
        state={editorState}
        dispatchTransaction={(tr) =>
          AppStore.editors.updateEditorState(node.id, tr)
        }
      >
        <TextboxMenu nodeId={node.id} />
        <SelectionActions node={node} />
        <div
          ref={setMount}
          onBlur={() => {
            syncNodeWithEditorValue(node.id);
          }}
        />
      </ProseMirror>
    </>
  );
};

export default ProseMirrorEditor;
