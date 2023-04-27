import CanvasStore from "modules/state/canvas/CanvasStore";
import { RootNode } from "modules/state/project/ProjectTypes";
import NodeArrows from "../arrows/NodeArrows";
import ProjectNode from "modules/editor/nodes/ProjectNode";
import { getPositionOfWholeBoard } from "./screenshot-utils";
import { useScreenshot } from "use-react-screenshot";
import { useEffect, useRef } from "react";

export interface ProjectScrenshotProps {
  nodes: RootNode[];
  width: number;
  height: number;
  onScreenshot: (img: string) => void;
}

const ProjectScrenshot = ({
  nodes,
  width,
  height,
  onScreenshot,
}: ProjectScrenshotProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const screen = getPositionOfWholeBoard(nodes);
  const scale = { x: width / screen.width, y: height / screen.height };
  console.log("screen", screen);
  const [image, takeScreenshot] = useScreenshot();

  useEffect(() => {
    if (ref.current) {
      takeScreenshot(ref.current);
    }
  }, [ref.current]);

  useEffect(() => {
    if (image) onScreenshot(image);
  }, [image]);

  return (
    <div
      ref={ref}
      className="fixed left-5 top-500"
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <div
        className="h-full w-full"
        style={{
          transform: `scale(${(scale.x, scale.y)})`,
          transformOrigin: "top left",
        }}
      >
        {nodes.map((node, index) => (
          <ProjectNode
            screen={{ ...screen, x: screen.left, y: screen.top }}
            key={index}
            node={node}
            cacheKey=""
            selected={false}
            viewOnly={true}
          ></ProjectNode>
        ))}
        <NodeArrows
          screen={screen}
          nodes={nodes}
          container={{ height, width }}
        />
      </div>
    </div>
  );
};

export default ProjectScrenshot;
