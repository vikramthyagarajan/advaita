import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import { isPresent } from "modules/core/function-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode, TextNode } from "modules/state/project/ProjectRegistry";
import { memo } from "react";
import { BoxNode } from "./BoxNode";

const TextElement = ({
  node,
  cacheKey,
}: {
  node: TextNode;
  cacheKey: string;
}) => {
  return (
    <div
      className="cursor-text outline-none"
      contentEditable
      suppressContentEditableWarning
    >
      {node.text}
    </div>
  );
};

const TextboxElement = ({
  node,
  selected,
  cacheKey,
  screen,
}: {
  node: TextboxNode;
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
        {node.children
          .map((child) => AppStore.project.getNode(child.id) as TextNode | null)
          .filter(isPresent)
          .map((sub) => (
            <TextElement key={sub.id} node={sub} cacheKey={sub.cacheKey} />
          ))}
      </div>
    </BoxNode>
  );
};

export default memo(TextboxElement);
