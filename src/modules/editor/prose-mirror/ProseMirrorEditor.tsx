import { useEffect, useState } from "react";
import { EditorState, TextSelection, Selection } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { exampleSetup } from "prosemirror-example-setup";
import AppStore from "modules/state/AppStore";

const ProseMirrorEditor = ({ node }: { node: TextboxNode }) => {
  const [mount, setMount] = useState<HTMLDivElement | null>(null);
  const [editorState, setEditorState] = useState(
    EditorState.create({
      doc: defaultMarkdownParser.parse(node.text) || undefined,
      plugins: exampleSetup({ schema }),
    })
  );
  useEffect(() => {
    const tr = editorState.tr;
    tr.setSelection(
      new TextSelection(tr.doc.resolve(0), tr.doc.resolve(tr.doc.content.size))
    );
    const textNode = defaultMarkdownParser.parse(node.text);
    if (textNode) tr.replaceSelectionWith(textNode);
    setEditorState((s) => s.apply(tr));
  }, [node.text]);

  return (
    <ProseMirror
      mount={mount}
      state={editorState}
      dispatchTransaction={(tr) => {
        setEditorState((s) => s.apply(tr));
      }}
    >
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
