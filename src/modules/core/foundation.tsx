import { PropsWithChildren } from "react";

export interface CanvasPosition {
  top: number;
  left: number;
}

export const Position = ({
  left,
  top,
  children,
}: PropsWithChildren<CanvasPosition>) => (
  <div
    className="absolute inline-block"
    style={{ left: `${left}px`, top: `${top}px` }}
  >
    {children}
  </div>
);
