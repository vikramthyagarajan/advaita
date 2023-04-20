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
        selection: { top: number; bottom: number };
      },
      { type: string; top?: number; bottom?: number }
    >
  >(
    (state, action) => {
      switch (action.type) {
        case "setSelection": {
          return {
            ...state,
            isVisible: true,
            selection: {
              top: action.top || 0,
              bottom: action.bottom || 0,
            },
          };
        }
        case "reset": {
          return {
            ...state,
            isVisible: false,
            selection: { top: 0, bottom: 0 },
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
        top: 0,
        bottom: 0,
      },
    }
  );
  useEditorEffect((view) => {
    const topCoordinates = view?.coordsAtPos(view.state.selection.anchor);
    const bottomCoordinates = view?.coordsAtPos(view.state.selection.head);
    if (!topCoordinates || !bottomCoordinates || view?.state.selection.empty) {
      if (isVisible) {
        dispatch({ type: "reset" });
      }
      return;
    }
    if (
      topCoordinates.top !== selection.top ||
      bottomCoordinates.bottom !== selection.bottom
    )
      dispatch({
        type: "setSelection",
        top: topCoordinates.top,
        bottom: bottomCoordinates.bottom,
      });
  });

  const scale = AppStore.canvas.scale;
  const unscaledScreen = AppStore.canvas.screen;
  const screen = unscaledScreen;
  const textNodePosition = node.position;
  const left = textNodePosition.width + 10;
  const top = selection.top / scale.y + screen.y - textNodePosition.top;
  const bottom =
    textNodePosition.top +
    textNodePosition.height -
    (selection.bottom / scale.y + screen.y);

  if (!isVisible) return <div></div>;

  return (
    <div
      className="absolute pl-1 border-l-2 border-l-slate-300 border-solid flex items-center"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        left,
        top,
        bottom,
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
