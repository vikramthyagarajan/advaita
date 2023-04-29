import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import {
  CanvasPosition,
  Position,
  ScreenPosition,
} from "modules/core/foundation";
import { PropsWithChildren } from "react";
import { useBoxHandlers } from "./BoxHandlers";

export interface BoxNodeProps {
  id: string;
  cacheKey: string;
  position: CanvasPosition;
  screen: ScreenPosition;
  actions?: () => JSX.Element;
}

export const BoxNode = ({
  id,
  cacheKey,
  position,
  children,
  screen,
  actions,
}: PropsWithChildren<BoxNodeProps>) => {
  const handlers = useBoxHandlers({ id, position });
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `drag-${id}`,
  });

  return (
    <Position screen={screen} {...position}>
      {/* lines */}
      <div
        className="absolute top-0 left-0 bg-transparent z-50 cursor-ns-resize touch-none"
        style={{ width: `${position.width - 16}px`, height: "2px", left: 8 }}
        {...handlers.edges.top()}
      ></div>
      <div
        className="absolute top-0 left-0 bg-transparent z-50 cursor-ew-resize touch-none"
        style={{ width: "2px", height: `${position.height - 16}px`, top: 8 }}
        {...handlers.edges.left()}
      ></div>
      <div
        className="absolute bottom-0 left-0 bg-transparent z-50 cursor-ns-resize touch-none"
        style={{ width: `${position.width - 16}px`, height: "2px", left: 8 }}
        {...handlers.edges.bottom()}
      ></div>
      <div
        className="absolute top-0 right-0 bg-transparent z-50 cursor-ew-resize touch-none"
        style={{ width: "2px", height: `${position.height - 16}px`, top: 8 }}
        {...handlers.edges.right()}
      ></div>
      {/* corners */}
      <div
        className="absolute top-0 left-0 bg-transparent z-50 cursor-nwse-resize touch-none"
        style={{ width: "8px", height: "8px" }}
        // {...handlers.corners.topLeft()}
      ></div>
      <div
        className="absolute bottom-0 left-0 bg-transparent z-50 cursor-nesw-resize touch-none"
        style={{ width: "8px", height: "8px" }}
        // {...handlers.corners.bottomLeft()}
      ></div>
      <div
        className="absolute bottom-0 right-0 bg-transparent z-50 cursor-nwse-resize touch-none"
        style={{ width: "8px", height: "8px" }}
        // {...handlers.corners.bottomRight()}
      ></div>
      <div
        className="absolute top-0 right-0 bg-transparent z-50 cursor-nesw-resize touch-none"
        style={{ width: "8px", height: "8px" }}
        // {...handlers.corners.topRight()}
      ></div>
      {actions ? actions() : null}
      <div
        className={clsx("absolute top-0 left-0 w-full h-full cursor-move")}
        ref={(ref) => {
          setNodeRef(ref);
        }}
        {...listeners}
        {...attributes}
      >
        {children}
      </div>
    </Position>
  );
};
