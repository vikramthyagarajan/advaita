import AppStore from "modules/state/AppStore";
import { getArrowPathsBetweenVisibleNodes } from "./arrow-utils";
import { CanvasPosition } from "modules/core/foundation";
import { RootNode } from "modules/state/project/ProjectTypes";

export interface NodeArrowsProps {
  screen: CanvasPosition;
  container: { width: number; height: number };
  nodes: RootNode[];
}

export interface NodeArrowProps {
  path: string;
  width: number;
  height: number;
}

const NodeArrow = ({ height, width, path }: NodeArrowProps) => {
  return (
    <svg className="absolute z-0" height={height} width={width}>
      <path
        d={path}
        className="border-gray-500"
        strokeWidth={3}
        fill="transparent"
        pointerEvents="visibleStroke"
        stroke="#6b7280"
      ></path>
    </svg>
  );
};

const NodeArrows = ({ nodes, screen, container }: NodeArrowsProps) => {
  // fetch the connections that need to be drawn
  // for each connection, figure out the path
  // draw the paths
  const paths = getArrowPathsBetweenVisibleNodes(nodes, {
    ...screen,
  });
  const { height, width } = container;
  const { x, y } = {
    x: container.width / screen.width,
    y: container.height / screen.height,
  };

  return (
    <div>
      {paths.map(({ path }, index) => {
        return (
          <NodeArrow
            key={index}
            path={path}
            height={height / y}
            width={width / x}
          />
        );
      })}
    </div>
  );
};

export default NodeArrows;
