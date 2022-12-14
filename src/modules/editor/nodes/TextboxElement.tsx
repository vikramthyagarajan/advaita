import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import { isPresent } from "modules/core/function-utils";
import AppStore from "modules/state/AppStore";
import {
  AllEventTypes,
  ImageNode,
  PreviewNode,
  TextboxNode,
  TextNode,
} from "modules/state/project/ProjectTypes";
import { getUiDispatch } from "modules/state/ui/UiStore";
import {
  FocusEvent,
  KeyboardEvent,
  memo,
  MouseEvent,
  RefObject,
  useRef,
} from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import { useTextState } from "./TextHandlers";

type ListenerType = {
  [key: string]: (
    id: string,
    ref: RefObject<HTMLDivElement>,
    e: AllEventTypes
  ) => void;
};
const TextElement = ({
  node,
  parent,
  index,
  cacheKey,
  listeners,
  setTextRef,
}: {
  node: TextNode;
  parent: TextboxNode;
  index: number;
  cacheKey: string;
  listeners: ListenerType;
  setTextRef: (id: string, ref: RefObject<HTMLDivElement>) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDroppable({
    id: `drop-${node.id}`,
    data: {
      type: "child",
    },
  });
  if (ref.current) {
    setTextRef(node.id, ref);
  }
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
      ref={setNodeRef}
      className={clsx("w-full flex", {
        "justify-center": !parent.align || parent.align === "center",
        "justify-start": parent.align === "left",
        "justify-end": parent.align === "right",
      })}
    >
      <div
        ref={ref}
        className={clsx("cursor-text outline-none z-50 relative", {
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
        {...Object.keys(listeners).reduce((acc, listenerKey) => {
          acc[listenerKey] = (e: AllEventTypes) =>
            listeners[listenerKey](node.id, ref, e);
          return acc;
        }, {} as { [key: string]: (e: AllEventTypes) => void })}
      >
        {node.text}
      </div>
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
      <img src={node.url} className="w-full"></img>
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
  const ref = useRef<HTMLDivElement>(null);
  const { listeners, setTextRef } = useTextState({ id: node.id, ref });
  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
      actions={() => <BoxActions id={node.id} elementRef={ref} />}
    >
      <div
        ref={ref}
        data-id={node.id}
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2",
          {
            "shadow-lg": selected,
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
                  parent={node}
                  cacheKey={sub.cacheKey}
                  index={index}
                  listeners={listeners}
                  setTextRef={setTextRef}
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
