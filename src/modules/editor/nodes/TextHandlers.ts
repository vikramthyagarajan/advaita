import { moveCaretToPoint } from "modules/core/dom-utils";
import { isCloseEnough } from "modules/core/math-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { MouseEvent, RefObject, useRef } from "react";

export const useTextState = ({
  id,
  ref,
}: {
  id: string;
  ref: RefObject<HTMLElement>;
}) => {
  const refMap = useRef<{ [key: string]: RefObject<HTMLDivElement> }>({});
  const node = AppStore.project.getNode(id) as TextboxNode;
  const setTextRef = (id: string, ref: RefObject<HTMLDivElement>) => {
    refMap.current[id] = ref;
  };
  const listeners = {
    onKeyDown: (childId: string, ref: RefObject<HTMLDivElement>, e: Event) => {
      const event = e as KeyboardEvent;
      const selection = window.getSelection();
      if (selection && selection?.rangeCount > 0) {
        switch (event.key) {
          case "ArrowLeft":
            break;
          case "ArrowUp": {
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();
            const elementRect = (
              event.currentTarget as HTMLDivElement
            )?.getBoundingClientRect();
            // incase no text selection (empty div), assume whole element is selected
            const textRect = rects[0] ? rects[0] : { ...elementRect };
            console.log("rects", elementRect, textRect, rects);
            const atTop = isCloseEnough(elementRect.top, textRect.top, 5);

            if (atTop) {
              event.preventDefault();
              const currentChildIndex = node.children.findIndex(
                (n) => n.id === childId
              );
              if (currentChildIndex > 0) {
                const prevChild = AppStore.project.getNode(
                  node.children[currentChildIndex - 1].id
                );
                const nextRef = refMap.current[prevChild.id];
                if (nextRef) {
                  moveCaretToPoint(textRect.left, elementRect.top - 5);
                }
              }
            }
            break;
          }
          case "ArrowRight":
            break;
          case "ArrowDown": {
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();
            const elementRect = (
              event.currentTarget as HTMLDivElement
            )?.getBoundingClientRect();
            // incase no text selection (empty div), assume whole element is selected
            const textRect = rects[0] ? rects[0] : { ...elementRect };
            const atBottom = isCloseEnough(
              elementRect.bottom,
              textRect.bottom,
              5
            );

            if (atBottom) {
              event.preventDefault();
              const currentChildIndex = node.children.findIndex(
                (n) => n.id === childId
              );
              if (currentChildIndex < node.children.length) {
                const nextChild = AppStore.project.getNode(
                  node.children[currentChildIndex + 1].id
                );
                const nextRef = refMap.current[nextChild.id];
                if (nextRef) {
                  moveCaretToPoint(textRect.left, elementRect.bottom + 5);
                }
              }
            }
            break;
          }
        }
      }
    },
    onMouseUp: (id: string, ref: RefObject<HTMLDivElement>, e: Event) => {
      const event = e as unknown as MouseEvent;
      console.log("getting position");
      const selection = window.getSelection();
      if (selection && selection?.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        console.log("got rects", rects, rects[0], rects[1]);

        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(event.currentTarget);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        //@ts-ignore
        const offsetTop = e.currentTarget.getBoundingClientRect().top;
        const boxTop = ref.current?.getBoundingClientRect().top || 0;
        const topOfElement = offsetTop - boxTop;
        console.log("at top of element", rects[0].top, offsetTop, boxTop);
        console.log("index", preCaretRange.toString());
      }
    },
  };

  return {
    listeners,
    setTextRef,
  };
};
