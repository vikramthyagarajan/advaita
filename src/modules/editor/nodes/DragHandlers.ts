import { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import AppStore from "modules/state/AppStore";
import { SubNode } from "modules/state/project/ProjectTypes";

export const onDragStart = (event: DragStartEvent) => {
  const { active } = event;
  AppStore.project.fork();
};

export const onDragMove = (event: DragMoveEvent) => {
  const { active, over, delta } = event;
  const dropNodeId = over?.id.toString().split("drop-")[1];
  const nodeId = active.id.toString().split("drag-")[1];
  const isSelf = dropNodeId === nodeId;
  const scale = AppStore.canvas.scale;
  const deltaX = delta.x / scale.x;
  const deltaY = delta.y / scale.y;

  AppStore.project.resetWithFork();
  const node = AppStore.project.getOriginNode(nodeId);
  if (!node || !("position" in node)) return;

  if (dropNodeId && !isSelf) {
    // merge boxes;
    const node = AppStore.project.getNode(nodeId);
    const dropNode = AppStore.project.getNode(dropNodeId);
    const childBoxes = node.children || [];
    childBoxes.forEach(({ id: childId }) => {
      const child = AppStore.project.getNode(childId) as SubNode;
      if (child)
        AppStore.project.addNodeChild(
          dropNode.id,
          child,
          dropNode.children?.length || 0
        );
    });
  } else {
    AppStore.project.moveBox(nodeId, {
      left: node.position.left + deltaX,
      top: node.position.top + deltaY,
    });
  }
};

export const onDragEnd = (event: DragEndEvent) => {
  const { active, over, delta } = event;
  AppStore.project.commit();
};
