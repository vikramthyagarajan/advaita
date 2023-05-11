import { moveCaretToPoint } from "modules/core/dom-utils";
import { isCloseEnough } from "modules/core/math-utils";
import AppStore from "modules/state/AppStore";
import {
  AllEventTypes,
  TextboxNode,
  TextNode,
} from "modules/state/project/ProjectTypes";
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  RefObject,
  useRef,
} from "react";

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
    onMouseUp: (
      childId: string,
      ref: RefObject<HTMLDivElement>,
      e: AllEventTypes
    ) => {
      const event = e as MouseEvent<HTMLDivElement>;
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
    onBlur: (
      childId: string,
      ref: RefObject<HTMLDivElement>,
      e: AllEventTypes
    ) => {
      const text = e.currentTarget.textContent || "";
      AppStore.project.setNode(childId, { text });
    },
  };

  return {
    listeners,
    setTextRef,
  };
};
