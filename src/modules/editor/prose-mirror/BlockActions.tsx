import { useEditorEffect } from "@nytimes/react-prosemirror";
import {
  forkDocumentQuery,
  saveDocumentQuery,
} from "modules/core/network-utils";
import { generateId } from "modules/core/project-utils";
import { placeBoxNearbyQuadtree } from "modules/playground/placement/placement-utils";
import AppStore from "modules/state/AppStore";
import { RootNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { Reducer, memo, useReducer } from "react";
import { MessageSquare } from "react-feather";
import { getUserSelectionDiff, syncNodeWithEditorValue } from "./SlateUtils";
import { stopEventBubbling } from "modules/core/dom-utils";
import {
  NotesRounded,
  TerminalRounded,
  TitleRounded,
} from "@mui/icons-material";

const NodeTypeIcon = ({
  node,
  nodeType,
}: {
  node: TextboxNode;
  nodeType: string | null;
}) => {
  if (!nodeType) return null;

  switch (nodeType) {
    case "paragraph": {
      return <NotesRounded />;
    }
    case "heading": {
      return <TitleRounded />;
    }
    case "code_block": {
      return <TerminalRounded />;
    }
    case "blockquote": {
      return <TerminalRounded />;
    }
    default:
      return null;
  }
};

const BlockActions = ({ node }: { node: TextboxNode }) => {
  const [{ isVisible, selection, nodeType }, dispatch] = useReducer<
    Reducer<
      {
        isVisible: boolean;
        selection: { top: number; bottom: number };
        nodeType: string | null;
      },
      { type: string; top?: number; bottom?: number; nodeType?: string | null }
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
        case "setNodeType": {
          return {
            ...state,
            nodeType: action.nodeType || "",
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
      nodeType: null,
      selection: {
        top: 0,
        bottom: 0,
      },
    }
  );
  useEditorEffect((view) => {
    const offsetTop = 40;
    const editorSelection = view?.state.selection;
    const node = editorSelection?.$anchor.node();
    const nextNode = editorSelection?.$anchor.nodeAfter;
    const newNodeType = node?.type.name || null;
    const startPosition = editorSelection?.$anchor.posAtIndex(0);
    const endPosition =
      nextNode && startPosition !== undefined
        ? startPosition + (node?.content.size || 0)
        : view?.state.doc.content.size;
    if (startPosition === undefined || endPosition === undefined) return;
    const topCoordinates = view?.coordsAtPos(startPosition);
    const bottomCoordinates = view?.coordsAtPos(endPosition);
    if (!topCoordinates || !bottomCoordinates) {
      if (isVisible) {
        dispatch({ type: "reset" });
      }
      return;
    }
    const topValue = topCoordinates.top - offsetTop;
    const bottomValue = bottomCoordinates.bottom - offsetTop;
    if (newNodeType !== nodeType) {
      console.log("setting node type", newNodeType);
      dispatch({ type: "setNodeType", nodeType: newNodeType });
    }
    if (topValue !== selection.top || bottomValue !== selection.bottom)
      dispatch({
        type: "setSelection",
        top: topValue,
        bottom: bottomValue,
      });
  });

  const scale = AppStore.canvas.scale;
  const unscaledScreen = AppStore.canvas.screen;
  const screen = unscaledScreen;
  const textNodePosition = node.position;
  const left = -10;
  const top = selection.top / scale.y + screen.y - textNodePosition.top;
  const bottom =
    textNodePosition.top +
    textNodePosition.height -
    (selection.bottom / scale.y + screen.y);

  if (!isVisible) return <div></div>;

  return (
    <div
      className="absolute pl-1 border-l-2 border-l-slate-300 border-solid flex flex-row-reverse items-center z-20"
      style={{
        visibility: isVisible ? "visible" : "visible",
        left,
        top,
        bottom,
      }}
    >
      <div
        className="p-1 bg-slate-200 absolute right-[10px]"
        onBlur={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div>
          <NodeTypeIcon node={node} nodeType={nodeType} />
        </div>
      </div>
    </div>
  );
};

export default memo(BlockActions);
