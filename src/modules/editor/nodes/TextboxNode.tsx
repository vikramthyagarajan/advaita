import clsx from "clsx";
import { Position, ScreenPosition } from "modules/core/foundation";
import { Node } from "modules/state/project/ProjectRegistry";
import { memo } from "react";
import { BoxNode } from "./BoxNode";

const TextboxNode = ({
  node,
  selected,
  cacheKey,
  screen,
}: {
  node: Node;
  screen: ScreenPosition;
  selected: boolean;
  cacheKey: string;
}) => {
  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
    >
      <div
        className={clsx(
          "flex items-center justify-center border-2 rounded-lg w-full h-full select-none",
          {
            "shadow-lg": selected,
          }
        )}
      >
        <div
          className="cursor-text outline-none"
          contentEditable
          suppressContentEditableWarning
        >
          {node.text}
        </div>
      </div>
    </BoxNode>
  );
};

export default memo(TextboxNode);
