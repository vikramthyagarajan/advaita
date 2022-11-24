import { RECT_H, RECT_W } from "modules/core/constants";
import { CanvasPosition, Position } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import CanvasStore from "modules/state/canvas/CanvasStore";
import { Node } from "modules/state/project/ProjectRegistry";
import { memo } from "react";

interface TextBlockProps extends CanvasPosition {
  text: string;
  color: string;
  width: number;
  height: number;
}

const TextBlock = ({
  text,
  color,
  left,
  top,
  width,
  height,
}: TextBlockProps) => {
  return (
    <Position left={left} top={top} width={width} height={height}>
      <div
        className="flex items-center justify-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: color,
        }}
      >
        {text}
      </div>
    </Position>
  );
};

const ProjectNode = (node: Node) => {
  if (node.type === "textbox") {
    return (
      <Position {...node.position}>
        <div className="flex items-center justify-center border-2 rounded-lg w-full h-full">
          <div>{node.text}</div>
        </div>
      </Position>
    );
  }
  return null;
};

const InfiniteCanvas = ({ frame }: { frame: string }) => {
  const texts = [
    "Infinite",
    "Canvases",
    "Are",
    "Easy",
    "When",
    "You",
    "Know",
    "The",
    "Fundamentals",
  ];

  const colors = [
    "#f1f7ed",
    "#61c9a8",
    "#7ca982",
    "#e0eec6",
    "#c2a83e",
    "#ff99c8",
    "#fcf6bd",
    "#9c92a3",
    "#c6b9cd",
  ];
  const rectW = RECT_W;
  const rectH = RECT_H;
  const scale = CanvasStore.scale;
  const nodes = AppStore.project.rootNodes;
  console.log("nodes", nodes);

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
