import CanvasStore from "modules/state/canvas/CanvasStore";
import { memo, useEffect, useRef } from "react";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import { useCanvasHandlers } from "./CanvasHandlers";
import { Widget } from "modules/state/ui/UiState";
import AppStore from "modules/state/AppStore";
import { getUiState } from "modules/state/ui/UiStore";
import clsx from "clsx";

export interface CanvasRootProps {
  frame: string;
}

const CanvasRoot = ({ frame }: { frame: string }) => {
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
  }, [width, height]);
  useCanvasHandlers(canvas);
  const { widget } = getUiState();

  return (
    <div className="w-full h-full relative">
      <div
        className={clsx(
          "w-full h-full relative overflow-hidden overscroll-none",
          {
            "cursor-crosshair": widget !== "pointer",
          }
        )}
        ref={canvas}
      >
        <InfiniteCanvas frame={frame}></InfiniteCanvas>
      </div>
    </div>
  );
};

export default CanvasRoot;
