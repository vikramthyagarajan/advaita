import CanvasStore from "modules/state/canvas/CanvasStore";
import { PropsWithChildren } from "react";
import { inBounds } from "./math-utils";

export interface CanvasPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ScreenPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionProps extends CanvasPosition {
  screen: ScreenPosition;
}

export const Position = ({
  left,
  top,
  width,
  height,
  screen,
  children,
}: PropsWithChildren<PositionProps>) => {
  if (
    inBounds(
      { left, top, height, width },
      {
        left: screen.x,
        top: screen.y,
        width: screen.width,
        height: screen.height,
      }
    )
  ) {
    return (
      <div
        className="absolute inline-block z-10 bg-white"
        style={{
          left: `${left - screen.x}px`,
          top: `${top - screen.y}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {children}
      </div>
    );
  } else return null;
};
