import { useDrag } from "@use-gesture/react";
import { CanvasPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";

export interface BoxHandlerProps {
  id: string;
  position: CanvasPosition;
}

const useResizeEdge = (
  id: string,
  edge: "right" | "left" | "top" | "bottom"
) => {
  const node = AppStore.project.getNode(id);
  const scale = AppStore.canvas.scale;

  return useDrag(({ down, delta: [x, y] }) => {
    const deltaX = x / scale.x;
    const deltaY = y / scale.y;
    switch (edge) {
      case "right": {
        AppStore.project.moveBox(id, {
          width: node.position.width + deltaX,
        });
        break;
      }
      case "left": {
        AppStore.project.moveBox(id, {
          width: node.position.width - deltaX,
          left: node.position.left + deltaX,
        });
        break;
      }
      case "top": {
        AppStore.project.moveBox(id, {
          height: node.position.height - deltaY,
          top: node.position.top + deltaY,
        });
        break;
      }
      case "bottom": {
        AppStore.project.moveBox(id, {
          height: node.position.height + deltaY,
        });
        break;
      }
      default:
        break;
    }
  });
};

const useResizeCorner = (
  id: string,
  edge: "top-right" | "top-left" | "bottom-left" | "bottom-right"
) => {
  const node = AppStore.project.getNode(id);
  const scale = AppStore.canvas.scale;

  return useDrag(({ down, delta: [x, y], direction }) => {
    const deltaX = x / scale.x;
    const deltaY = y / scale.y;
    // console.log("check del", deltaX, deltaY, delta);
    switch (edge) {
      case "top-right": {
        const delta = direction[0] === 0 ? -1 * deltaY : deltaX;
        AppStore.project.moveBox(id, {
          top: node.position.top - delta,
          height: node.position.height + delta,
          width: node.position.width + delta,
        });
        break;
      }
      case "top-left": {
        const delta = direction[0] === 0 ? deltaY : deltaX;
        AppStore.project.moveBox(id, {
          top: node.position.top + delta,
          left: node.position.left + delta,
          height: node.position.height - delta,
          width: node.position.width - delta,
        });
        break;
      }
      case "bottom-left": {
        const delta = direction[0] === 0 ? -1 * deltaY : deltaX;
        AppStore.project.moveBox(id, {
          left: node.position.left + delta,
          height: node.position.height - delta,
          width: node.position.width - delta,
        });
        break;
      }
      case "bottom-right": {
        const delta = direction[0] === 0 ? deltaY : deltaX;
        AppStore.project.moveBox(id, {
          height: node.position.height + delta,
          width: node.position.width + delta,
        });
        break;
      }
      default:
        break;
    }
  });
};

const useDragBox = (id: string) => {
  return useDrag(({ down, delta: [x, y] }) => {
    const node = AppStore.project.getNode(id);
    const scale = AppStore.canvas.scale;
    const deltaX = x / scale.x;
    const deltaY = y / scale.y;

    AppStore.project.moveBox(id, {
      left: node.position.left + deltaX,
      top: node.position.top + deltaY,
    });
  });
};

export const useBoxHandlers = ({ id, position }: BoxHandlerProps) => {
  return {
    edges: {
      left: useResizeEdge(id, "left"),
      right: useResizeEdge(id, "right"),
      top: useResizeEdge(id, "top"),
      bottom: useResizeEdge(id, "bottom"),
    },
    corners: {
      topLeft: useResizeCorner(id, "top-left"),
      topRight: useResizeCorner(id, "top-right"),
      bottomLeft: useResizeCorner(id, "bottom-left"),
      bottomRight: useResizeCorner(id, "bottom-right"),
    },
    group: {
      box: useDragBox(id),
    },
  };
};
