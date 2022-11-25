import clsx from "clsx";
import { CanvasPosition, Position } from "modules/core/foundation";
import { memo, PropsWithChildren } from "react";

export interface BoxNodeProps {
  position: CanvasPosition;
}

export const BoxNode = memo(
  ({ position, children }: PropsWithChildren<BoxNodeProps>) => {
    return (
      <Position {...position}>
        {/* lines */}
        <div
          className="absolute top-0 left-0 bg-transparent z-50 cursor-ns-resize"
          style={{ width: `${position.width - 16}px`, height: "2px", left: 8 }}
        ></div>
        <div
          className="absolute top-0 left-0 bg-transparent z-50 cursor-ew-resize"
          style={{ width: "2px", height: `${position.height - 16}px`, top: 8 }}
        ></div>
        <div
          className="absolute bottom-0 left-0 bg-transparent z-50 cursor-ns-resize"
          style={{ width: `${position.width - 16}px`, height: "2px", left: 8 }}
        ></div>
        <div
          className="absolute top-0 right-0 bg-transparent z-50 cursor-ew-resize"
          style={{ width: "2px", height: `${position.height - 16}px`, top: 8 }}
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
  }
);
