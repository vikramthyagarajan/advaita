import CanvasStore from "modules/state/CanvasStore";
import { useEffect, useRef, WheelEvent } from "react";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import useRenderLoop from "modules/core/RenderLoop";

const wheelListener = (e: WheelEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const friction = 1;
  const event = e as WheelEvent;
  const deltaX = event.deltaX * friction;
  const deltaY = event.deltaY * friction;
  if (!event.ctrlKey) {
    CanvasStore.moveCamera(deltaX, deltaY);
  } else {
    CanvasStore.zoomCamera(deltaX, deltaY);
  }
};

const pointerListener = (event: PointerEvent) => {
  event.preventDefault();
  event.stopPropagation();
  CanvasStore.movePointer(event.offsetX, event.offsetY);
};

const CanvasRoot = () => {
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
  }, [width, height]);
  const frame = useRenderLoop(60);
  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full relative overflow-hidden"
        ref={canvas}
        onWheel={wheelListener}
      >
        <InfiniteCanvas frame={frame}></InfiniteCanvas>
      </div>
    </div>
  );
};

export default CanvasRoot;
