import { createNewDocumentQuery } from "modules/core/network-utils";
import { generateId, getAuthorId } from "modules/core/project-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { getUiDispatch, getUiState } from "modules/state/ui/UiStore";
import { RefObject, useEffect } from "react";

let pointerState = {
  id: "",
  started: false,
  x: 0,
  y: 0,
};

const wheelListener = (updateArrows: () => void, e: WheelEvent) => {
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
  updateArrows();
};
const pointerMoveListener = (updateArrows: () => void, event: PointerEvent) => {
  const { widget } = getUiState();
  const screen = AppStore.canvas.screen;
  const scale = AppStore.canvas.scale;
  AppStore.canvas.movePointer(event.clientX, event.clientY);
  const localStart = { x: event.clientX, y: event.clientY };
  const globalStart = {
    x: localStart.x / scale.x + screen.x,
    y: localStart.y / scale.y + screen.y,
  };
  if (pointerState.started && widget === "textbox") {
    AppStore.project.addTextbox(pointerState.id, {
      position: {
        left: pointerState.x,
        top: pointerState.y,
        width: globalStart.x - pointerState.x,
        height: globalStart.y - pointerState.y,
      },
    });
    updateArrows();
  }
};

const pointerDownListener = (event: PointerEvent) => {
  const widget = getUiState().widget;
  const screen = AppStore.canvas.screen;
  const scale = AppStore.canvas.scale;
  if (widget === "textbox" || widget === "image") {
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
  const dispatch = getUiDispatch();
  dispatch({ type: "widgetUpdated", widget: "pointer" });
  if (widget === "textbox") {
    AppStore.project.setNode(pointerState.id, {
      text: "# Start writing...\n## Type something",
    });
    const node = AppStore.project.getNode(
      pointerState.id
    ) as TextboxNode | null;
    if (node) {
      AppStore.project.rootNodes
        .filter((n) => n.id !== node.id)
        .filter((n, i) => i === 0)
        .map((n) =>
          // AppStore.project.setNode(n.id, {
          //   connections: [...(n.connections || []), { id: node.id }],
          // })
        );
      createNewDocumentQuery(node.title || "", getAuthorId() || "unknown", node)
        .then((response) => {
          console.log("Got creation response", response);
        })
        .catch((e) => {
          console.error("Error during creation:", e);
        });
    }
  }
  pointerState.started = false;
  pointerState.x = 0;
  pointerState.y = 0;
};

export const useCanvasHandlers = (
  ref: RefObject<HTMLDivElement>,
  updateArrows: () => void
) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener(
        "wheel",
        wheelListener.bind(null, updateArrows),
        { passive: false }
      );
      ref.current.addEventListener("pointerdown", pointerDownListener);
      ref.current.addEventListener("pointerup", pointerUpListener);
      ref.current.addEventListener(
        "pointermove",
        pointerMoveListener.bind(null, updateArrows)
      );
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener(
          "wheel",
          wheelListener.bind(null, updateArrows)
        );
        ref.current.removeEventListener("pointerdown", pointerDownListener);
        ref.current.removeEventListener("pointerup", pointerUpListener);
        ref.current.removeEventListener(
          "pointermove",
          pointerMoveListener.bind(null, updateArrows)
        );
      }
    };
  }, [ref]);
};
