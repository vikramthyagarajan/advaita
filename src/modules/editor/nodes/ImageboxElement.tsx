import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import { isPresent } from "modules/core/function-utils";
import AppStore from "modules/state/AppStore";
import {
  ImageboxNode,
  ImageNode,
  TextboxNode,
} from "modules/state/project/ProjectTypes";
import { memo, useRef } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";

export interface ImageboxElementProps {
  node: ImageboxNode;
  screen: ScreenPosition;
  selected: boolean;
  cacheKey: string;
}

const InnerTextboxElement = ({
  node,
}: {
  node: TextboxNode;
  cacheKey: string;
}) => {
  return (
    <div
      className={clsx("absolute flex flex-col w-full h-full select-none p-2", {
        "justify-start": node.vertical === "top",
        "justify-center": node.vertical === "center",
      })}
      style={{
        left: node.position.left,
        top: node.position.top,
        height: node.position.height,
        width: node.position.width,
      }}
    >
      {node.children.map(({ id, type }) => {
        const child = AppStore.project.getNode(id);
        if (child.type === "text")
          return (
            <div
              className={clsx("cursor-text outline-none flex z-50", {
                "justify-center": !node.align || node.align === "center",
                "justify-start": node.align === "left",
                "justify-end": node.align === "right",
                "font-bold": child.bold,
                italic: child.italic,
                underline: child.underline,
                "text-3xl font-bold": child.style === "heading-1",
                "text-2xl font-semibold": child.style === "heading-2",
                "text-xl": child.style === "heading-3",
              })}
              data-id={child.id}
              contentEditable
              suppressContentEditableWarning
            >
              {child.text}
            </div>
          );
      })}
    </div>
  );
};

const ImageboxElement = ({
  node,
  cacheKey,
  screen,
  selected,
}: ImageboxElementProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
      actions={() => <BoxActions id={node.id} elementRef={ref} />}
    >
      <div
        data-id={node.id}
        ref={ref}
        className={clsx(
          "relative flex flex-col border-2 rounded-lg w-full h-full select-none p-2 overflow-hidden border-slate-200",
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
            const child = val as ImageNode | TextboxNode;
            if (child.type === "image")
              return (
                <img
                  key={child.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: child.position.left,
                    top: child.position.top,
                    width: "100%",
                    height: "100%",
                  }}
                  src={child.url}
                />
              );
            else if (child.type === "textbox") {
              return (
                <InnerTextboxElement
                  node={child}
                  cacheKey={child.cacheKey}
                  key={child.id}
                />
              );
            }
          })}
      </div>
    </BoxNode>
  );
};

export default memo(ImageboxElement);
