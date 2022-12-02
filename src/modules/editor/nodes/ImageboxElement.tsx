import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import { isPresent } from "modules/core/function-utils";
import AppStore from "modules/state/AppStore";
import { ImageboxNode, ImageNode } from "modules/state/project/ProjectRegistry";
import { memo } from "react";
import { BoxNode } from "./BoxNode";

export interface ImageboxElementProps {
  node: ImageboxNode;
  screen: ScreenPosition;
  selected: boolean;
  cacheKey: string;
}

const ImageboxElement = ({
  node,
  cacheKey,
  screen,
  selected,
}: ImageboxElementProps) => {
  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
    >
      <div
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2",
          {
            "shadow-lg": selected,
          }
        )}
      >
        {node.children
          .map((child, index) => ({
            val: AppStore.project.getNode(child.id) as ImageNode | null,
            index,
          }))
          .filter(({ val }) => isPresent(val))
          .map(({ val, index }) => {
            const child = val as ImageNode;
            return (
              <img
                className="absolute pointer-events-none"
                style={{
                  left: child.position.left,
                  top: child.position.top,
                  width: child.position.width,
                  height: child.position.height,
                }}
                src={child.url}
              />
            );
          })}
      </div>
    </BoxNode>
  );
};

export default memo(ImageboxElement);
