import { generateId } from "modules/core/project-utils";
import AppStore from "modules/state/AppStore";
import { useEffect } from "react";
import { placeBoxNearbyQuadtree } from "../placement/placement-utils";
import { TextboxNode } from "modules/state/project/ProjectTypes";

export const useArrowsPlaygroundData = () => {
  useEffect(() => {
    AppStore.project.resetWithFork();
    const parentBox = { left: 1500, top: 1500, width: 200, height: 300 };
    const boundingBox = { left: 625, top: 1000, height: 1000, width: 1700 };
    const parentId = generateId();
    const box = placeBoxNearbyQuadtree(parentBox, [], boundingBox);
    if (!box) return;
    const parentNode = AppStore.project.addTextbox(parentId, {
      position: { ...box },
    });
    for (let i = 0; i < 5; i++) {
      const newId = generateId();
      const newBox = placeBoxNearbyQuadtree(
        parentBox,
        AppStore.project.rootNodes,
        boundingBox,
        20
      );
      if (!newBox) continue;
      AppStore.project.addTextbox(newId, { position: newBox });
      const parentNode = AppStore.project.getNode(parentId) as TextboxNode;
      AppStore.project.setNode(parentId, {
        connections: [...(parentNode.connections || []), { id: newId }],
      });
    }
    [generateId(), generateId(), generateId()].reduce<string | null>(
      (prev, newId) => {
        const newBox = placeBoxNearbyQuadtree(
          parentBox,
          AppStore.project.rootNodes,
          boundingBox,
          20
        );
        if (!newBox) return null;
        AppStore.project.addTextbox(newId, { position: newBox });
        if (prev)
          AppStore.project.setNode(newId, { connections: [{ id: prev }] });
        return newId;
      },
      null
    );
    setTimeout(() => {
      AppStore.canvas.zoomCamera(0, 50);
    }, 1000);
  }, []);
};
