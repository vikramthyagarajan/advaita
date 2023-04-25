import { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { CanvasPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import { SubNode } from "modules/state/project/ProjectTypes";

export const onDragStart = (event: DragStartEvent) => {
  const { active } = event;
  AppStore.project.fork();
};

export const onDragMove = (event: DragMoveEvent, callback?: () => void) => {
  const { active, over, delta } = event;
  const nodeId = active.id.toString().split("drag-")[1];
  const scale = AppStore.canvas.scale;
  const deltaX = delta.x / scale.x;
  const deltaY = delta.y / scale.y;

  AppStore.project.resetWithFork();
  const node = AppStore.project.getOriginNode(nodeId);
  if (!node || !("position" in node)) return;

  AppStore.project.moveBox(nodeId, {
    left: node.position.left + deltaX,
    top: node.position.top + deltaY,
  });
  if (callback) callback();
};

export const onDragEnd = (event: DragEndEvent) => {
  const { active, over, delta } = event;
  const nodeId = active.id.toString().split("drag-")[1];
  const node = AppStore.project.getOriginNode(nodeId);
  const scale = AppStore.canvas.scale;
  const deltaX = delta.x / scale.x;
  const deltaY = delta.y / scale.y;
  AppStore.project.resetWithFork();
  if (!node || !("position" in node)) return;

  AppStore.project.moveBox(nodeId, {
    left: node.position.left + deltaX,
    top: node.position.top + deltaY,
  });
  AppStore.project.commit();
};
