import { Position, ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import CanvasStore from "modules/state/canvas/CanvasStore";
import { getUiState } from "modules/state/ui/UiStore";
import { memo } from "react";
import ProjectNode from "./nodes/ProjectNode";
import NodeArrows from "modules/playground/arrows/NodeArrows";

const ImagePreview = memo(
  ({
    pointerX,
    pointerY,
  }: {
    frame: string;
    pointerX: number;
    pointerY: number;
  }) => {
    const { urlPreview, widget } = getUiState();
    const screen = AppStore.canvas.screen;
    if (widget === "image" && urlPreview) {
      return (
        <Position
          left={pointerX}
          top={pointerY}
          height={50}
          width={50}
          screen={screen}
        >
          <div className="bg-slate-500 p-[1px]">
            <img className="" src={urlPreview} />
          </div>
        </Position>
      );
    }
    return null;
  }
);

const InfiniteCanvas = ({ frame }: { frame: string }) => {
  const scale = CanvasStore.scale;
  const screen = CanvasStore.screenPosition;
  const nodes = AppStore.project.rootNodes;
  const { selectedNode: selected } = getUiState();
  const container = AppStore.canvas.container;
  const { x, y } = AppStore.canvas.pointer;

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
          screen={screen}
          key={index}
          node={node}
          cacheKey={node.cacheKey}
          selected={node.id === selected}
        ></ProjectNode>
      ))}
      <ImagePreview frame={frame} pointerX={x} pointerY={y} />
      <NodeArrows nodes={nodes} screen={screen} container={container} />
    </div>
  );
};

export default memo(InfiniteCanvas);
