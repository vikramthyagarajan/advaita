import { CanvasPosition } from "modules/core/foundation";
import { RootNode } from "modules/state/project/ProjectTypes";

export const getPositionOfWholeBoard = (nodes: RootNode[]): CanvasPosition => {
  const padding = 50;
  if (nodes.length === 0) return { left: 0, top: 0, height: 0, width: 0 };
  let left = Infinity;
  let top = Infinity;
  let bottom = 0;
  let right = 0;

  nodes.forEach((node) => {
    left = Math.min(left, node.position.left - padding);
    top = Math.min(top, node.position.top - padding);
    right = Math.max(right, node.position.left + node.position.width + padding);
    bottom = Math.max(
      bottom,
      node.position.top + node.position.height + padding
    );
  });

  return { left, top, width: right - left, height: bottom - top };
};
