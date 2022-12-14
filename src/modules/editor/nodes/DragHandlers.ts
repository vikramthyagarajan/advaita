import { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { CanvasPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import { SubNode } from "modules/state/project/ProjectTypes";

export const onDragStart = (event: DragStartEvent) => {
  const { active } = event;
  AppStore.project.fork();
};

export const onDragMove = (event: DragMoveEvent) => {
  const { active, over, delta } = event;
  const dropNodeId = over?.id.toString().split("drop-")[1];
  const overData = over?.data.current;
  const overType = overData?.type || "parent";
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
    if (overType === "parent") {
      const node = AppStore.project.getNode(nodeId);
      const dropRect = over.rect;
      const activeRect = active.rect.current.translated;
      if (!activeRect) return;
      const newPosition: CanvasPosition = {
        left: activeRect.left - dropRect.left,
        top: activeRect.top - dropRect.top,
        height: activeRect.height,
        width: activeRect.width,
      };
      AppStore.project.setNode(nodeId, { position: newPosition });
      AppStore.project.addNodeChild(dropNodeId, {
        id: nodeId,
        type: node.type,
      });
    } else {
      const childDropNode = AppStore.project.getNode(dropNodeId);
      const parentDropNode = AppStore.project.getNode(
        childDropNode.parent || ""
      );
      const childBoxes = node.children || [];
      if (childDropNode && parentDropNode) {
        const index =
          parentDropNode.children?.findIndex(
            (c) => c.id === childDropNode.id
          ) || -1;
        if (index === -1) return;
        AppStore.project.addNodeChild(
          parentDropNode.id,
          { id: "preview", type: "preview" },
          index
        );
      }
    }
  } else {
    AppStore.project.moveBox(nodeId, {
      left: node.position.left + deltaX,
      top: node.position.top + deltaY,
    });
  }
};

export const onDragEnd = (event: DragEndEvent) => {
  const { active, over, delta } = event;
  const dropNodeId = over?.id.toString().split("drop-")[1];
  const nodeId = active.id.toString().split("drag-")[1];
  const isSelf = dropNodeId === nodeId;
  const node = AppStore.project.getOriginNode(nodeId);
  const overData = over?.data.current;
  const overType = overData?.type || "parent";
  const scale = AppStore.canvas.scale;
  const deltaX = delta.x / scale.x;
  const deltaY = delta.y / scale.y;
  AppStore.project.resetWithFork();
  if (!node || !("position" in node)) return;

  if (dropNodeId && !isSelf) {
    if (overType === "parent") {
      const node = AppStore.project.getNode(nodeId);
      const dropRect = over.rect;
      const activeRect = active.rect.current.translated;
      if (!activeRect) return;
      const newPosition: CanvasPosition = {
        left: activeRect.left - dropRect.left,
        top: activeRect.top - dropRect.top,
        height: activeRect.height,
        width: activeRect.width,
      };
      AppStore.project.setNode(nodeId, { position: newPosition });
      AppStore.project.addNodeChild(dropNodeId, {
        id: nodeId,
        type: node.type,
      });
    } else {
      const childDropNode = AppStore.project.getNode(dropNodeId);
      const parentDropNode = AppStore.project.getNode(
        childDropNode.parent || ""
      );
      const childBoxes = node.children || [];
      if (childDropNode && parentDropNode) {
        const index =
          parentDropNode.children?.findIndex(
            (c) => c.id === childDropNode.id
          ) || -1;
        if (index === -1) return;
        [...childBoxes].reverse().forEach(({ id: childId }) => {
          const child = AppStore.project.getNode(childId) as SubNode;
          if (child)
            AppStore.project.addNodeChild(parentDropNode.id, child, index);
        });
      }
      AppStore.project.removeNode(nodeId);
    }
  } else {
    AppStore.project.moveBox(nodeId, {
      left: node.position.left + deltaX,
      top: node.position.top + deltaY,
    });
  }
  AppStore.project.commit();
};
