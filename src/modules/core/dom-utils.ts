export const moveCaretToPoint = (x: number, y: number) => {
  let node: Node | null = null,
    offset: number = 0;
  // @ts-ignore
  if ("caretPositionFromPoint" in document && document.caretPositionFromPoint) {
    //@ts-ignore
    const caretRange = document.caretPositionFromPoint(e.clientX, e.clientY);
    node = caretRange.offsetNode as Node;
    offset = caretRange.offset;
  } else if (document.caretRangeFromPoint) {
    // Use WebKit-proprietary fallback method
    const range = document.caretRangeFromPoint(x, y);
    console.log("got range", range);
    if (range) {
      node = range.startContainer;
      offset = range.startOffset;
    }
  } else {
    // Neither method is supported, do nothing
    return;
  }

  const selection = window.getSelection();
  const newRange = document.createRange();
  if (node && selection) {
    newRange.setEnd(node, offset);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};
