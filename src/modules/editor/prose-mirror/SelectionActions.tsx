import { useEditorEffect } from "@nytimes/react-prosemirror";
import {
  forkDocumentQuery,
  saveDocumentQuery,
} from "modules/core/network-utils";
import { generateId } from "modules/core/project-utils";
import { placeBoxNearbyQuadtree } from "modules/playground/placement/placement-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { Reducer, useReducer } from "react";
import { MessageSquare } from "react-feather";
import { getUserSelectionDiff, syncNodeWithEditorValue } from "./SlateUtils";
import { stopEventBubbling } from "modules/core/dom-utils";

const onFork = (nodeId: string) => {
  const node = AppStore.project.getNode(nodeId) as TextboxNode;
  const editorState = AppStore.editors.getEditorState(nodeId);
  if (!editorState || !node) return;

  syncNodeWithEditorValue(nodeId);
  const boundingBox = {
    left: node.position.left - 2000,
    top: node.position.top - 2000,
    width: node.position.width + 4000,
    height: node.position.height + 4000,
  };
  const newPosition = placeBoxNearbyQuadtree(
    node.position,
    AppStore.project.rootNodes,
    boundingBox,
    20
  );
  if (!newPosition) return;
  const position = { ...newPosition };

  const { original, diff, selection, preText, postText } =
    getUserSelectionDiff(editorState);
  console.log("checking diff", original, diff);
  const id = generateId();
  const connections = [...(node.connections || []), { id }];
  AppStore.project.setNode(node.id, {
    connections,
  });
  AppStore.project.addTextbox(id, { position });
  AppStore.project.setNode(id, {
    parent: node.id,
    text: diff,
    preText,
    postText,
    selection: selection as [number, number],
  });
  AppStore.canvas.centerNodeOnScreen(id);
  const forkedNode = AppStore.project.getNode(id) as TextboxNode;
  const originalNode = AppStore.project.getNode(node.id);
  // saveDocumentQuery(node.id, originalNode);
  forkDocumentQuery({
    id: nodeId,
    diff,
    original,
    author: forkedNode.author,
    forkedNode,
  });
};

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
    const offsetTop = 40;
    const topCoordinates = view?.coordsAtPos(view.state.selection.anchor);
    const bottomCoordinates = view?.coordsAtPos(view.state.selection.head);
    if (!topCoordinates || !bottomCoordinates || view?.state.selection.empty) {
      if (isVisible) {
        dispatch({ type: "reset" });
      }
      return;
    }
    const topValue = topCoordinates.top - offsetTop;
    const bottomValue = bottomCoordinates.bottom - offsetTop;
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
  const left = textNodePosition.width + 10;
  const top = selection.top / scale.y + screen.y - textNodePosition.top;
  const bottom =
    textNodePosition.top +
    textNodePosition.height -
    (selection.bottom / scale.y + screen.y);

  if (!isVisible) return <div></div>;

  return (
    <div
      className="absolute pl-1 border-l-2 border-l-slate-300 border-solid flex items-center z-20"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        left,
        top,
        bottom,
      }}
    >
      <div
        className="p-1 bg-slate-200"
        onBlur={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div>
          <MessageSquare
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFork(node.id);
            }}
          ></MessageSquare>
        </div>
      </div>
    </div>
  );
};

export default SelectionActions;
