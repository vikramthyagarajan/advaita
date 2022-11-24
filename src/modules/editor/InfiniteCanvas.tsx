import { Position } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import CanvasStore from "modules/state/canvas/CanvasStore";
import { Node } from "modules/state/project/ProjectRegistry";
import { memo } from "react";

const ProjectNode = (node: Node) => {
  if (node.type === "textbox") {
    return (
      <Position {...node.position}>
        <div className="flex items-center justify-center border-2 rounded-lg w-full h-full select-none">
          <div className="cursor-text">{node.text}</div>
        </div>
      </Position>
    );
  }
  return null;
};

const InfiniteCanvas = ({ frame }: { frame: string }) => {
  const scale = CanvasStore.scale;
  const nodes = AppStore.project.rootNodes;

  return (
    <div
      className="w-full h-full"
      style={{
        transform: `scale(${(scale.x, scale.y)})`,
        transformOrigin: "top left",
      }}
    >
      {nodes.map((node, index) => (
        <ProjectNode key={index} {...node}></ProjectNode>
      ))}
    </div>
  );
};

export default memo(InfiniteCanvas);
