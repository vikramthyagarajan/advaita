import clsx from "clsx";
import { Position } from "modules/core/foundation";
import { Node } from "modules/state/project/ProjectRegistry";
import { memo } from "react";

const TextboxNode = ({
  node,
  selected,
  cacheKey,
}: {
  node: Node;
  selected: boolean;
  cacheKey: string;
}) => {
  return (
    <Position {...node.position}>
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
    </Position>
  );
};

export default memo(TextboxNode);
