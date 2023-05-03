import useRenderLoop from "modules/core/RenderLoop";
import AppStore from "modules/state/AppStore";
import { useUiStore } from "modules/state/ui/UiStore";
import { useEffect, useRef } from "react";
import CanvasRoot from "./CanvasRoot";
import { ElementInspector } from "./inspector/ElementInspector";
import WidgetDock from "./widgets/WidgetDock";
import { initializeSockets } from "modules/core/network-utils";
import { Outlet, useLoaderData } from "react-router-dom";
import { Board, User } from "modules/core/NetworkTypes";
import ProjectScreenshot from "modules/playground/screenshots/ProjectScreenshot";

const Editor = () => {
  const { user, board } = useLoaderData() as {
    user: User;
    board: Board;
  };
  const { widget, selectedNode: selected, selectedChild } = useUiStore();
  const { screenshotId, onScreenshot } = AppStore.data.getScreenshotData();
  useEffect(() => {
    if (board) {
      AppStore.project.board = board;
      AppStore.project.___loadState(
        board.uuid,
        JSON.parse(JSON.stringify(board.data))
      );
    }
    if (user) {
      AppStore.project.user = user;
    }
    initializeSockets();
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
      <ProjectScreenshot
        screenshotId={screenshotId}
        onScreenshot={onScreenshot}
        width={800}
        height={800}
      />
      <Outlet />
    </div>
  );
};

export default Editor;
