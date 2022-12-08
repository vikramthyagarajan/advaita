import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import { isPresent } from "modules/core/function-utils";
import AppStore from "modules/state/AppStore";
import {
  ImageNode,
  PreviewNode,
  TextboxNode,
  TextNode,
} from "modules/state/project/ProjectTypes";
import { getUiDispatch } from "modules/state/ui/UiStore";
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
  const ref = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDroppable({
    id: `drop-${node.id}`,
    data: {
      type: "child",
    },
  });
  if (node.editOnCreate && ref.current) {
    const selection = window.getSelection();
    const range = document.createRange();
    const dispatch = getUiDispatch();
    if (selection && ref.current) {
      selection.removeAllRanges();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      selection.addRange(range);
      ref.current?.focus();
      dispatch({ type: "nodeSelected", id: node.parent, childId: node.id });
      AppStore.project.setEditOnCreate(node.id, false);
    }
  } else if (!ref.current) AppStore.canvas.shouldRender = true;

  return (
    <div
      ref={(el) => {
        ref.current = el;
        setNodeRef(el);
      }}
      className={clsx("cursor-text outline-none z-50", {
        "font-bold": node.bold,
        italic: node.italic,
        underline: node.underline,
        "text-3xl font-bold": node.style === "heading-1",
        "text-2xl font-semibold": node.style === "heading-2",
        "text-xl": node.style === "heading-3",
      })}
      data-id={node.id}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.textContent || "";
        AppStore.project.setNode(node.id, { text });
      }}
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
        } else if (e.key === "Backspace" && !e.currentTarget.textContent) {
          if (node.parent) {
            const parent = AppStore.project.getNode(node.parent) as TextboxNode;
            if (index > 0)
              AppStore.project.setEditOnCreate(
                parent.children[index - 1].id,
                true
              );
            AppStore.project.removeChildNode(node.parent, node.id);
            AppStore.canvas.shouldRender = true;
          }
        }
      }}
    >
      {node.text}
    </div>
  );
};

const ImageElement = ({
  node,
  index,
  cacheKey,
}: {
  node: ImageNode;
  index: number;
  cacheKey: string;
}) => {
  return (
    <div>
      <img src={node.url} className="w-24 h-24"></img>
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
        data-id={node.id}
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2",
          {
            "shadow-lg": selected,
            "items-center": !node.align || node.align === "center",
            "items-start": node.align === "left",
            "items-end": node.align === "right",
            "justify-start": node.vertical === "top",
            "justify-center": node.vertical === "center",
          }
        )}
      >
        {node.children
          .map((child, index) => ({
            val: AppStore.project.getNode(child.id) as
              | TextNode
              | ImageNode
              | null,
            child,
            index,
          }))
          // .filter(({ val }) => isPresent(val))
          .map(({ val, child, index }) => {
            const sub = val as TextNode | ImageNode | PreviewNode;
            if (child.type === "preview")
              return (
                <div className="border border-slate-400 w-24 h-[2px]"></div>
              );
            else if (sub.type === "text")
              return (
                <TextElement
                  key={index}
                  node={sub}
                  cacheKey={sub.cacheKey}
                  index={index}
                />
              );
            else if (sub.type === "image")
              return (
                <ImageElement
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
