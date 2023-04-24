import AppStore from "modules/state/AppStore";
import { getArrowPathsBetweenVisibleNodes } from "./arrow-utils";

export interface NodeArrowsProps {}

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

const NodeArrows = (props: NodeArrowsProps) => {
  // fetch the connections that need to be drawn
  // for each connection, figure out the path
  // draw the paths
  const nodes = AppStore.project.rootNodes;
  const screen = AppStore.canvas.screen;
  const paths = getArrowPathsBetweenVisibleNodes(nodes, {
    ...screen,
    left: screen.x,
    top: screen.y,
  });
  const { height, width } = AppStore.canvas.container;
  //@ts-ignore
  window.paths = paths;
  //@ts-ignore
  window.nodes = nodes;

  return (
    <div>
      {paths.map(({ path }, index) => {
        return (
          <NodeArrow key={index} path={path} height={height} width={width} />
        );
      })}
    </div>
  );
};

export default NodeArrows;
