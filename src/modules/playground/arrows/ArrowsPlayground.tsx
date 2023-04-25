import clsx from "clsx";
import { useArrowsPlaygroundData } from "./ArrowsPlaygroundHelpers";
import useRenderLoop from "modules/core/RenderLoop";
import { useEffect, useRef } from "react";
import InfiniteCanvas from "modules/editor/InfiniteCanvas";
import { useUiStore } from "modules/state/ui/UiStore";
import useSize from "@react-hook/size";
import CanvasStore from "modules/state/canvas/CanvasStore";

const ArrowsPlayground = () => {
  useUiStore();
  const frame = useRenderLoop(60);
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
  }, [width, height]);
  useArrowsPlaygroundData();

  return (
    <div className="w-full h-full relative flex">
      <div
        className={clsx(
          "w-full h-full relative overflow-hidden overscroll-none"
        )}
        ref={canvas}
      >
        <InfiniteCanvas frame={frame}></InfiniteCanvas>;
      </div>
    </div>
  );
};

export default ArrowsPlayground;
