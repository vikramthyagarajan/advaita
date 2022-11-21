import CanvasStore from "modules/state/CanvasStore";
import { useEffect, useRef } from "react";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import useRenderLoop from "modules/core/RenderLoop";

const CanvasRoot = () => {
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
  }, [width, height]);
  useRenderLoop(15);
  return (
    <div className="w-full h-full">
      <div className="w-full h-full" ref={canvas}>
        <InfiniteCanvas></InfiniteCanvas>
      </div>
    </div>
  );
};

export default CanvasRoot;
