import clsx from "clsx";
import {
  CanvasPosition,
  Position,
  ScreenPosition,
} from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import { memo, PropsWithChildren } from "react";
import { useBoxHandlers } from "./BoxHandlers";

export interface BoxNodeProps {
  id: string;
  cacheKey: string;
  position: CanvasPosition;
  screen: ScreenPosition;
}

export const BoxNode = ({
  id,
  cacheKey,
  position,
  children,
  screen,
}: PropsWithChildren<BoxNodeProps>) => {
  const handlers = useBoxHandlers({ id, position });
  return (
    <Position screen={screen} {...position}>
      {/* lines */}
      <div
        className="absolute top-0 left-0 bg-transparent z-50 cursor-ns-resize"
        style={{ width: `${position.width - 16}px`, height: "2px", left: 8 }}
        {...handlers.edges.top()}
      ></div>
      <div
        className="absolute top-0 left-0 bg-transparent z-50 cursor-ew-resize"
        style={{ width: "2px", height: `${position.height - 16}px`, top: 8 }}
        {...handlers.edges.left()}
      ></div>
      <div
        className="absolute bottom-0 left-0 bg-transparent z-50 cursor-ns-resize"
        style={{ width: `${position.width - 16}px`, height: "2px", left: 8 }}
        {...handlers.edges.bottom()}
      ></div>
      <div
        className="absolute top-0 right-0 bg-transparent z-50 cursor-ew-resize"
        style={{ width: "2px", height: `${position.height - 16}px`, top: 8 }}
        {...handlers.edges.right()}
      ></div>
      {/* corners */}
      <div
        className="absolute top-0 left-0 bg-transparent z-50 cursor-nwse-resize"
        style={{ width: "8px", height: "8px" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 bg-transparent z-50 cursor-nesw-resize"
        style={{ width: "8px", height: "8px" }}
      ></div>
      <div
        className="absolute bottom-0 right-0 bg-transparent z-50 cursor-nwse-resize"
        style={{ width: "8px", height: "8px" }}
      ></div>
      <div
        className="absolute top-0 right-0 bg-transparent z-50 cursor-nesw-resize"
        style={{ width: "8px", height: "8px" }}
      ></div>
      {children}
    </Position>
  );
};
