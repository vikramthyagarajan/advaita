import CanvasStore from "modules/state/canvas/CanvasStore";
import { useEffect, useRef } from "react";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import { useCanvasHandlers } from "./CanvasHandlers";

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

  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full relative overflow-hidden overscroll-none"
        ref={canvas}
      >
        <InfiniteCanvas frame={frame}></InfiniteCanvas>
      </div>
    </div>
  );
};

export default CanvasRoot;
