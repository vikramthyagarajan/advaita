import clsx from "clsx";
import useRenderLoop from "modules/core/RenderLoop";
import { useEffect, useRef, useState } from "react";
import InfiniteCanvas from "modules/editor/InfiniteCanvas";
import { useUiStore } from "modules/state/ui/UiStore";
import useSize from "@react-hook/size";
import CanvasStore from "modules/state/canvas/CanvasStore";
import AppStore from "modules/state/AppStore";
import { generateId } from "modules/core/project-utils";
import { placeBoxNearbyQuadtree } from "../placement/placement-utils";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import ProjectScrenshot from "./ProjectScreenshot";
import { uploadToCloudinary } from "modules/core/network-utils";

const generateRandomPlaygroundData = () => {
  AppStore.project.resetWithFork();
  const parentBox = { left: 1000, top: 1000, width: 300, height: 600 };
  const boundingBox = { left: 0, top: 0, height: 4000, width: 4000 };
  const parentId = generateId();
  const box = placeBoxNearbyQuadtree(parentBox, [], boundingBox);
  if (!box) return;
  const parentNode = AppStore.project.addTextbox(parentId, {
    position: { ...box },
    text: "# Origin",
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
    AppStore.project.addTextbox(newId, { position: newBox, text: "## Child" });
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
      AppStore.project.addTextbox(newId, {
        position: newBox,
        text: "### Others",
      });
      if (prev)
        AppStore.project.setNode(newId, { connections: [{ id: prev }] });
      return newId;
    },
    null
  );
};

export const useScreenshotPlaygroundData = () => {
  const [screenshotId, setScreenshotId] = useState("");
  useEffect(() => {
    generateRandomPlaygroundData();
    setScreenshotId(generateId());
  }, []);

  return {
    screenshotId,
    takeScreenshot: () => {
      setScreenshotId(generateId());
    },
  };
};

const ScreenshotPlayground = () => {
  useUiStore();
  const canvas = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(canvas);
  useEffect(() => {
    if (width === 0 || height === 0) return;
    CanvasStore.initialize(width, height);
  }, [width, height]);
  const [screenshotId, setScreenshotId] = useState(generateId());
  const [image, setImage] = useState("/signup-image.png");
  useScreenshotPlaygroundData();
  const nodes = AppStore.project.rootNodes;
  const onScreenshot = (image) => {
    setImage(image);
    uploadToCloudinary(screenshotId, image);
  };
  if (nodes.length === 0) return <div></div>;

  return (
    <div className="w-full h-full relative flex">
      <div
        className={clsx(
          "w-full h-full relative overflow-hidden overscroll-none"
        )}
        ref={canvas}
      >
        <div className="h-full w-full grid grid-cols-[3fr_1fr]">
          <div className="h-full flex items-center justify-center">
            <img src={image} className="w-[800px] h-[800px] object-cover"></img>
          </div>
          <div className="h-full flex items-center justify-center">
            <button
              className="py-5 px-20 outline-none bg-slate-800 rounded-md text-white"
              onClick={() => {
                generateRandomPlaygroundData();
                setScreenshotId(generateId());
              }}
            >
              Randomize
            </button>
          </div>
        </div>
        <ProjectScrenshot
          width={800}
          height={800}
          screenshotId={screenshotId}
          onScreenshot={onScreenshot}
        />
      </div>
    </div>
  );
};

export default ScreenshotPlayground;
