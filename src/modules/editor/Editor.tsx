import useRenderLoop from "modules/core/RenderLoop";
import AppStore from "modules/state/AppStore";
import { useUiStore } from "modules/state/ui/UiStore";
import { useEffect, useRef } from "react";
import CanvasRoot from "./CanvasRoot";
import { ElementInspector } from "./inspector/ElementInspector";
import WidgetDock from "./widgets/WidgetDock";
import {
  fetchAllDocumentsQuery,
  initializeSockets,
} from "modules/core/network-utils";
import { useLoaderData } from "react-router-dom";
import { Board, User } from "modules/core/NetworkTypes";
import { saveBoard } from "modules/core/project-utils";

const Editor = () => {
  const { user, board } = useLoaderData() as {
    user: { data: User };
    board: { data: Board };
  };
  const { widget, selectedNode: selected, selectedChild } = useUiStore();
  useEffect(() => {
    if (board && board.data) {
      AppStore.project.board = board.data;
      AppStore.project.___loadState(
        board.data.uuid,
        JSON.parse(JSON.stringify(board.data.data))
      );
    }
    if (user && user.data) {
      AppStore.project.user = user.data;
    }
    initializeSockets();
    // const interval = setInterval(() => {
    //   saveBoard();
    // }, 15000);

    return () => {
      // clearInterval(interval);
    };
  }, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const frame = useRenderLoop(60);
  const selectedNode =
    selected !== null ? AppStore.project.getNode(selected) : null;
  const cacheKey = selectedNode?.cacheKey || null;

  return (
    <div className="w-full h-full relative" ref={rootRef}>
      <CanvasRoot frame={frame} />
      <WidgetDock selectedWidget={widget} />
      <ElementInspector
        selectedNode={selected}
        cacheKey={cacheKey}
        selectedChild={selectedChild}
      />
    </div>
  );
};

export default Editor;
