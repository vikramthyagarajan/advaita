import { useEffect, useState } from "react";
import { TextSelection } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { defaultMarkdownParser } from "prosemirror-markdown";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import AppStore from "modules/state/AppStore";
import SelectionActions from "./SelectionActions";
import { useTextEditorState } from "./useTextEditorState";
import { syncNodeWithEditorValue } from "./SlateUtils";
import { saveBoard } from "modules/core/project-utils";

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
    <>
      <ProseMirror
        mount={mount}
        state={editorState}
        dispatchTransaction={(tr) =>
          AppStore.editors.updateEditorState(node.id, tr)
        }
      >
        <SelectionActions node={node} />
        {/* <BlockActions node={node} /> */}
        <div
          ref={setMount}
          onBlur={() => {
            syncNodeWithEditorValue(node.id);
            saveBoard();
          }}
        />
      </ProseMirror>
    </>
  );
};

export default ProseMirrorEditor;
