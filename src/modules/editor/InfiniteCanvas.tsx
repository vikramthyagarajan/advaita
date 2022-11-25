import { Position } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import CanvasStore from "modules/state/canvas/CanvasStore";
import { Node } from "modules/state/project/ProjectRegistry";
import { getUiState } from "modules/state/ui/UiStore";
import { memo } from "react";
import TextboxNode from "./nodes/TextboxNode";

const ProjectNode = memo(
  ({
    node,
    selected,
    cacheKey,
  }: {
    node: Node;
    selected: boolean;
    cacheKey: string;
  }) => {
    if (node.type === "textbox") {
      return (
        <TextboxNode node={node} selected={selected} cacheKey={cacheKey} />
      );
    }
    return null;
  }
);

const InfiniteCanvas = ({ frame }: { frame: string }) => {
  const scale = CanvasStore.scale;
  const nodes = AppStore.project.rootNodes;
  const { selected } = getUiState();

  return (
    <div
      className="w-full h-full"
      style={{
        transform: `scale(${(scale.x, scale.y)})`,
        transformOrigin: "top left",
      }}
    >
      {nodes.map((node, index) => (
        <ProjectNode
          key={index}
          node={node}
          cacheKey={node.cacheKey}
          selected={node.id === selected}
        ></ProjectNode>
      ))}
    </div>
  );
};

export default memo(InfiniteCanvas);
