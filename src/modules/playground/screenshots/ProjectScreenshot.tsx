import NodeArrows from "../arrows/NodeArrows";
import ProjectNode from "modules/editor/nodes/ProjectNode";
import { getPositionOfWholeBoard } from "./screenshot-utils";
import { useScreenshot } from "use-react-screenshot";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import AppStore from "modules/state/AppStore";
import clsx from "clsx";

export interface ProjectScrenshotProps {
  screenshotId: string;
  width: number;
  height: number;
  onScreenshot: (img: string) => void;
}

interface ProjectScreenshotLifecycleProps {
  screenshotId: string;
  width: number;
  height: number;
  onScreenshot: (img: string) => void;
  ref: RefObject<HTMLDivElement>;
}

const useProjectScreenshotLifecycle = ({
  screenshotId,
  width,
  height,
  ref,
  onScreenshot,
}: ProjectScreenshotLifecycleProps) => {
  const [visible, setVisible] = useState(false);
  const [image, takeScreenshot] = useScreenshot();
  useLayoutEffect(() => {
    if (visible) takeScreenshot(ref.current);
  }, [visible]);

  useEffect(() => {
    setVisible(true);
  }, [screenshotId, width, height]);

  useEffect(() => {
    if (image) {
      onScreenshot(image);
      setVisible(false);
    }
  }, [image]);

  return {
    visible,
  };
};

const ProjectScrenshot = ({
  width,
  height,
  onScreenshot,
  screenshotId,
}: ProjectScrenshotProps) => {
  const nodes = AppStore.project.rootNodes;
  const ref = useRef<HTMLDivElement>(null);
  const screen = getPositionOfWholeBoard(nodes);
  const scale = { x: width / screen.width, y: height / screen.height };
  const { visible } = useProjectScreenshotLifecycle({
    width,
    height,
    onScreenshot,
    screenshotId,
    ref,
  });

  return (
    <div
      ref={ref}
      className={clsx("fixed left-5 bg-slate-100", {
        hidden: !visible,
        block: visible,
      })}
      style={{ height: `${height}px`, width: `${width}px`, top: "200vh" }}
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
