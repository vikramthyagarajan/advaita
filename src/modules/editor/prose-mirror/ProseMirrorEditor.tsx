import { useEffect, useReducer, useState } from "react";
import { EditorState, TextSelection, Selection } from "prosemirror-state";
import { ProseMirror, useEditorEffect } from "@nytimes/react-prosemirror";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { exampleSetup } from "prosemirror-example-setup";
import AppStore from "modules/state/AppStore";
import { Reducer } from "react";
import { MessageSquare } from "react-feather";

const SelectionActions = ({ node }: { node: TextboxNode }) => {
  const [{ isVisible, selection }, dispatch] = useReducer<
    Reducer<
      {
        isVisible: boolean;
        selection: { left: number; top: number; bottom: number };
      },
      { type: string; left?: number; top?: number; bottom?: number }
    >
  >(
    (state, action) => {
      switch (action.type) {
        case "setSelection": {
          return {
            ...state,
            isVisible: true,
            selection: {
              left: action.left || 0,
              top: action.top || 0,
              bottom: action.bottom || 0,
            },
          };
        }
        case "reset": {
          return {
            ...state,
            isVisible: false,
            selection: { left: 0, top: 0, bottom: 0 },
          };
        }
        default: {
          return { ...state, isVisible: false };
        }
      }
    },
    {
      isVisible: false,
      selection: {
        left: 0,
        top: 0,
        bottom: 0,
      },
    }
  );

  useEditorEffect((view) => {
    // if (view?.state.selection.empty) return;
    const topCoordinates = view?.coordsAtPos(view.state.selection.anchor);
    const bottomCoordinates = view?.coordsAtPos(view.state.selection.head);
    if (!topCoordinates || !bottomCoordinates || view?.state.selection.empty) {
      if (isVisible) {
        dispatch({ type: "reset" });
      }
      return;
    }
    const textNode = AppStore.project.getNode(node.id) as TextboxNode;
    const left = textNode.position.width + 10;
    const top =
      topCoordinates.top + AppStore.canvas.screen.y - textNode.position.top;
    const bottom =
      textNode.position.top +
      textNode.position.height -
      (bottomCoordinates.bottom + AppStore.canvas.screen.y);
    // setSelection({});
    // console.log("check pos", topCoordinates, bottomCoordinates);
    if (
      selection.left !== left ||
      selection.top !== top ||
      selection.bottom !== bottom
    )
      dispatch({
        type: "setSelection",
        left,
        top,
        bottom,
      });
  });

  if (!isVisible) return <div></div>;

  return (
    <div
      className="absolute pl-1 border-l-2 border-l-slate-300 border-solid flex items-center"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        left: selection.left,
        top: selection.top,
        bottom: selection.bottom,
      }}
    >
      <div className="p-1 bg-slate-200">
        <div>
          <MessageSquare onClick={() => {}}></MessageSquare>
        </div>
      </div>
    </div>
  );
};

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
