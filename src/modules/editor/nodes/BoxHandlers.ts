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

export const useBoxHandlers = ({ id, position }: BoxHandlerProps) => {
  return {
    edges: {
      left: useResizeEdge(id, "left"),
      right: useResizeEdge(id, "right"),
      top: useResizeEdge(id, "top"),
      bottom: useResizeEdge(id, "bottom"),
    },
  };
};
