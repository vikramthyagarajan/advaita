import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import { isPresent } from "modules/core/function-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode, TextNode } from "modules/state/project/ProjectRegistry";
import { memo, useRef } from "react";
import { BoxNode } from "./BoxNode";

const TextElement = ({
  node,
  index,
  cacheKey,
}: {
  node: TextNode;
  index: number;
  cacheKey: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  if (node.editOnCreate && ref.current) {
    const selection = window.getSelection();
    const range = document.createRange();
    if (selection && ref.current) {
      selection.removeAllRanges();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      selection.addRange(range);
      ref.current?.focus();
      AppStore.project.setEditOnCreate(node.id, false);
    }
  } else if (!ref.current) AppStore.canvas.shouldRender = true;

  return (
    <div
      ref={ref}
      className="cursor-text outline-none"
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (node.parent) {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
            AppStore.project.addTextToBox(node.parent || "", "", {
              at: index + 1,
              editOnCreate: true,
            });
          }
        }
      }}
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
          "flex flex-col items-center justify-center border-2 rounded-lg w-full h-full select-none",
          {
            "shadow-lg": selected,
          }
        )}
      >
        {node.children
          .map((child, index) => ({
            val: AppStore.project.getNode(child.id) as TextNode | null,
            index,
          }))
          .filter(({ val }) => isPresent(val))
          .map(({ val, index }) => {
            const sub = val as TextNode;
            return (
              <TextElement
                key={sub.id}
                node={sub}
                cacheKey={sub.cacheKey}
                index={index}
              />
            );
          })}
      </div>
    </BoxNode>
  );
};

export default memo(TextboxElement);
