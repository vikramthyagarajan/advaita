import { generateId } from "modules/core/project-utils";
import AppStore from "modules/state/AppStore";
import { getUiDispatch, getUiState } from "modules/state/ui/UiStore";
import { RefObject, useEffect } from "react";

const wheelListener = (e: WheelEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const friction = 1;
  const event = e as WheelEvent;
  const deltaX = event.deltaX * friction;
  const deltaY = event.deltaY * friction;
  if (!event.ctrlKey) {
    AppStore.canvas.moveCamera(deltaX, deltaY);
  } else {
    AppStore.canvas.zoomCamera(deltaX, deltaY);
  }
};
const pointerMoveListener = (event: PointerEvent) => {
  const widget = getUiState().widget;
  const screen = AppStore.canvas.screen;
  const scale = AppStore.canvas.scale;
  AppStore.canvas.movePointer(event.clientX, event.clientY);
  if (pointerState.started && widget === "textbox") {
    const localStart = { x: event.clientX, y: event.clientY };
    const globalStart = {
      x: localStart.x / scale.x + screen.x,
      y: localStart.y / scale.y + screen.y,
    };
    AppStore.project.addTextbox(pointerState.id, {
      position: {
        left: pointerState.x,
        top: pointerState.y,
        width: globalStart.x - pointerState.x,
        height: globalStart.y - pointerState.y,
      },
    });
  }
};

let pointerState = {
  id: "",
  started: false,
  x: 0,
  y: 0,
};
const pointerDownListener = (event: PointerEvent) => {
  const widget = getUiState().widget;
  const screen = AppStore.canvas.screen;
  const scale = AppStore.canvas.scale;
  if (widget === "textbox") {
    const localStart = { x: event.clientX, y: event.clientY };
    const globalStart = {
      x: localStart.x / scale.x + screen.x,
      y: localStart.y / scale.y + screen.y,
    };
    pointerState.id = generateId();
    pointerState.x = globalStart.x;
    pointerState.y = globalStart.y;
    pointerState.started = true;
  }
};

const pointerUpListener = (event: PointerEvent) => {
  const widget = getUiState().widget;
  if (widget === "textbox" && pointerState.started) {
    AppStore.project.addTextToBox(pointerState.id, "Textbox");
    const dispatch = getUiDispatch();
    dispatch({ type: "widgetUpdated", widget: "pointer" });
    dispatch({ type: "nodeSelected", id: pointerState.id });
  }
  pointerState.started = false;
  pointerState.x = 0;
  pointerState.y = 0;
};

export const useCanvasHandlers = (ref: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("wheel", wheelListener, { passive: false });
      ref.current.addEventListener("pointerdown", pointerDownListener);
      ref.current.addEventListener("pointerup", pointerUpListener);
      ref.current.addEventListener("pointermove", pointerMoveListener);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("wheel", wheelListener);
        ref.current.removeEventListener("pointerdown", pointerDownListener);
        ref.current.removeEventListener("pointerup", pointerUpListener);
        ref.current.removeEventListener("pointermove", pointerMoveListener);
      }
    };
  }, [ref]);
};
