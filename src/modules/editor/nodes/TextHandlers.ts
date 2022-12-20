import { moveCaretToPoint } from "modules/core/dom-utils";
import { isCloseEnough } from "modules/core/math-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode, TextNode } from "modules/state/project/ProjectTypes";
import { MouseEvent, RefObject, useRef } from "react";

export const useTextState = ({
  id,
  ref: boxRef,
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
      const childNode = AppStore.project.getNode(childId) as TextNode | null;
      if (selection && selection?.rangeCount > 0) {
        switch (event.key) {
          case "ArrowLeft": {
            const range = selection.getRangeAt(0);
            const elementRect = (
              event.currentTarget as HTMLDivElement
            )?.getBoundingClientRect();
            const textboxRect = boxRef.current?.getBoundingClientRect();
            // incase no text selection (empty div), assume whole element is selected
            const atStart = range.endOffset === 0;

            if (atStart) {
              event.preventDefault();
              const currentChildIndex = node.children.findIndex(
                (n) => n.id === childId
              );
              if (currentChildIndex > 0) {
                const prevChild = AppStore.project.getNode(
                  node.children[currentChildIndex - 1].id
                );
                const nextRef = refMap.current[prevChild.id];
                if (nextRef && textboxRect) {
                  moveCaretToPoint(textboxRect.right - 5, elementRect.top - 5);
                }
              }
            }
            break;
          }
          case "ArrowUp": {
            const range = selection.getRangeAt(0);
            const duplicated = range.cloneRange();
            duplicated.collapse();
            const rects = duplicated.getClientRects();
            const elementRect = (
              event.currentTarget as HTMLDivElement
            )?.getBoundingClientRect();
            // incase no text selection (empty div), assume whole element is selected
            const textRect = rects[0] ? rects[0] : { ...elementRect.toJSON() };
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
          case "ArrowRight": {
            const range = selection.getRangeAt(0);
            const elementRect = (
              event.currentTarget as HTMLDivElement
            )?.getBoundingClientRect();
            const textboxRect = boxRef.current?.getBoundingClientRect();
            // incase no text selection (empty div), assume whole element is selected
            const atEnd =
              childNode && range.endOffset === childNode.text.length;

            if (atEnd) {
              event.preventDefault();
              const currentChildIndex = node.children.findIndex(
                (n) => n.id === childId
              );
              if (currentChildIndex < node.children.length) {
                const nextChild = AppStore.project.getNode(
                  node.children[currentChildIndex + 1].id
                );
                const nextRef = refMap.current[nextChild.id];
                if (nextRef && textboxRect) {
                  moveCaretToPoint(
                    textboxRect.left + 5,
                    elementRect.bottom + 5
                  );
                }
              }
            }
            break;
          }
          case "ArrowDown": {
            const range = selection.getRangeAt(0);
            const elementRect = (
              event.currentTarget as HTMLDivElement
            )?.getBoundingClientRect();
            // incase no text selection (empty div), assume whole element is selected
            const duplicated = range.cloneRange();
            duplicated.collapse();
            const rects = duplicated.getClientRects();
            const textRect = rects[0] ? rects[0] : { ...elementRect.toJSON() };
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
                  moveCaretToPoint(textRect.left, elementRect.bottom + 5, {
                    extendSelection: event.shiftKey,
                  });
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
      const selection = window.getSelection();
      if (selection && selection?.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();

        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(event.currentTarget);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        //@ts-ignore
        const offsetTop = e.currentTarget.getBoundingClientRect().top;
        const boxTop = ref.current?.getBoundingClientRect().top || 0;
        const topOfElement = offsetTop - boxTop;
      }
    },
  };

  return {
    listeners,
    setTextRef,
  };
};
