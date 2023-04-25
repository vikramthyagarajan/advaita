import { RootNode } from "modules/state/project/ProjectTypes";
import { CanvasPosition } from "modules/core/foundation";
import { inBounds } from "modules/core/math-utils";
import AppStore from "modules/state/AppStore";

type Edge = "left" | "top" | "right" | "bottom";
type AnchorPoint = { edge: Edge; point: Point };
type Point = [number, number];
type ConnectionNode = { id: string; position: CanvasPosition };
const getConnectionsInView = (nodes: RootNode[], screen: CanvasPosition) => {
  // generates an array of pairs
  return nodes
    .reduce<[ConnectionNode, ConnectionNode][]>((acc, node, index) => {
      if (node.connections) {
        acc = acc.concat([
          ...(node.connections || []).map((connection) => {
            const childNode = nodes.find(
              (n) => n.id === connection.id
            ) as RootNode;
            return [
              { id: node.id, position: node.position },
              { id: connection.id, position: childNode.position },
            ] as [ConnectionNode, ConnectionNode];
          }),
        ]);
      }
      return acc;
    }, [])
    .filter(([connection1, connection2]) => {
      return (
        inBounds(connection1.position, screen) ||
        inBounds(connection2.position, screen)
      );
    });
};

const getEdgesOfBox = ({
  left,
  top,
  width,
  height,
}: CanvasPosition): AnchorPoint[] => {
  return [
    { edge: "top", point: [left + width / 2, top] },
    { edge: "left", point: [left, top + height / 2] },
    { edge: "bottom", point: [left + width / 2, top + height] },
    { edge: "right", point: [left + width, top + height / 2] },
  ];
};

const getPointOnScreen = (point: Point, screen: CanvasPosition): Point => {
  return [point[0] - screen.left, point[1] - screen.top];
};

const getDistanceBetweenPoints = (p1: Point, p2: Point) => {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
};

const getPointsBetweenConnections = (
  connection: [ConnectionNode, ConnectionNode]
): [
  { id: string; anchor: AnchorPoint },
  { id: string; anchor: AnchorPoint }
] => {
  // find the closest edges
  // find the edge center points of c1
  // find the edge center poitns of c2
  // figure out the minimum distance from these 16 pairs
  const c1Edges = getEdgesOfBox(connection[0].position);
  const c2Edges = getEdgesOfBox(connection[1].position);

  let minDistance = Infinity;
  let firstEdge: AnchorPoint | null = null;
  let secondEdge: AnchorPoint | null = null;
  for (let edge1 of c1Edges) {
    for (let edge2 of c2Edges) {
      const distance = getDistanceBetweenPoints(edge1.point, edge2.point);
      if (distance <= minDistance) {
        minDistance = distance;
        firstEdge = edge1;
        secondEdge = edge2;
      }
    }
  }
  if (!firstEdge || !secondEdge) {
    console.error(
      "Could not find connection between points",
      connection[0],
      connection[1]
    );
    throw new Error("Could not find connection between points");
  }

  return [
    { id: connection[0].id, anchor: firstEdge },
    { id: connection[1].id, anchor: secondEdge },
  ];
};

const getPathArgsForConnection = (
  connection: [ConnectionNode, ConnectionNode]
): {
  start: { id: string; anchor: AnchorPoint };
  end: { id: string; anchor: AnchorPoint };
  controlPoints: [Point, Point];
} => {
  const points = getPointsBetweenConnections(connection);
  const startPoint = points[0];
  const endPoint = points[1];
  const x1 = startPoint.anchor.point[0];
  const y1 = startPoint.anchor.point[1];
  const x2 = endPoint.anchor.point[0];
  const y2 = endPoint.anchor.point[1];
  let dx = x2 - x1;
  let dy = y2 - y1;
  let absDx = Math.abs(dx);
  let absDy = Math.abs(dy);
  let xSign = dx > 0 ? 1 : -1;
  let ySign = dy > 0 ? 1 : -1;
  let cpx1 = x1;
  let cpy1 = y1;
  let cpx2 = x2;
  let cpy2 = y2;

  const curvesPossibilities = {
    hh: () => {
      //horizontal - from right to left or the opposite
      cpx1 += absDx * xSign;
      cpx2 -= absDx * xSign;
    },
    vv: () => {
      //vertical - from top to bottom or opposite
      cpy1 += absDy * ySign;
      cpy2 -= absDy * ySign;
    },
    hv: () => {
      // start horizontally then vertically
      // from v side to h side
      cpx1 += absDx * xSign;
      cpy2 -= absDy * ySign;
    },
    vh: () => {
      // start vertically then horizontally
      // from h side to v side
      cpy1 += absDy * ySign;
      cpx2 -= absDx * xSign;
    },
  };

  let selectedCurviness = "";
  if (["left", "right"].includes(startPoint.anchor.edge))
    selectedCurviness += "h";
  else if (["bottom", "top"].includes(startPoint.anchor.edge))
    selectedCurviness += "v";
  if (["left", "right"].includes(endPoint.anchor.edge))
    selectedCurviness += "h";
  else if (["bottom", "top"].includes(endPoint.anchor.edge))
    selectedCurviness += "v";
  curvesPossibilities[selectedCurviness]();

  return {
    start: startPoint,
    end: endPoint,
    controlPoints: [
      [cpx1, cpy1],
      [cpx2, cpy2],
    ],
  };
};

export const getArrowPathsBetweenVisibleNodes = (
  nodes: RootNode[],
  screen: CanvasPosition
) => {
  return getConnectionsInView(nodes, {
    ...screen,
  }).map((connection) => {
    const args = getPathArgsForConnection(connection);
    const [x1, y1] = getPointOnScreen(args.start.anchor.point, screen);
    const [x2, y2] = getPointOnScreen(args.end.anchor.point, screen);
    const [cpx1, cpy1] = getPointOnScreen(args.controlPoints[0], screen);
    const [cpx2, cpy2] = getPointOnScreen(args.controlPoints[1], screen);

    return {
      start: args.start,
      end: args.end,
      path: `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`,
      width: x2 - x1,
      height: y2 - y1,
    };
  });
};
