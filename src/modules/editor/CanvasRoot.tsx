import CanvasStore from "modules/state/canvas/CanvasStore";
import { DragEvent, PointerEvent, useEffect, useRef, WheelEvent } from "react";
import useSize from "@react-hook/size";
import InfiniteCanvas from "./InfiniteCanvas";
import useRenderLoop from "modules/core/RenderLoop";
import { getUiState } from "modules/state/ui/UiStore";
import AppStore from "modules/state/AppStore";

const wheelListener = (e: WheelEvent) => {
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
  CanvasStore.movePointer(event.clientX, event.clientY);
};

let pointerState = {
  started: false,
  x: 0,
  y: 0,
};
const pointerDownListener = (event: PointerEvent) => {
  const widget = getUiState().widget;
  const screen = AppStore.canvas.screen;
  if (widget === "textbox") {
    const localStart = { x: event.clientX, y: event.clientY };
    const globalStart = {
      x: localStart.x + screen.x,
      y: localStart.y + screen.y,
    };
    pointerState.x = globalStart.x;
    pointerState.y = globalStart.y;
    pointerState.started = true;
  }
};

const pointerUpListener = (event: PointerEvent) => {
  const widget = getUiState().widget;
  const screen = AppStore.canvas.screen;
  if (widget === "textbox" && pointerState.started) {
    const localStart = { x: event.clientX, y: event.clientY };
    const globalStart = {
      x: localStart.x + screen.x,
      y: localStart.y + screen.y,
    };
    AppStore.project.addTextbox({
      position: {
        left: pointerState.x,
        top: pointerState.y,
        width: globalStart.x - pointerState.x,
        height: globalStart.y - pointerState.y,
      },
    });
    console.log("drawing from", pointerState, globalStart);
  }
  pointerState.started = false;
  pointerState.x = 0;
  pointerState.y = 0;
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
        className="w-full h-full relative overflow-hidden overscroll-none"
        ref={canvas}
        onWheel={wheelListener}
        onPointerMove={pointerListener}
        onPointerDown={pointerDownListener}
        onPointerUp={pointerUpListener}
      >
        <InfiniteCanvas frame={frame}></InfiniteCanvas>
      </div>
    </div>
  );
};

export default CanvasRoot;
