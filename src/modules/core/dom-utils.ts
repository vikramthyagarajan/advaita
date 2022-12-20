export const moveCaretToPoint = (
  x: number,
  y: number,
  options: { extendSelection?: boolean } = {}
) => {
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
    if (range) {
      node = range.endContainer;
      offset = range.endOffset;
    }
  } else {
    // Neither method is supported, do nothing
    return;
  }
  console.log("offset is", node, offset);

  const selection = window.getSelection();
  const existingRange = selection?.getRangeAt(0);
  const newRange = existingRange?.cloneRange();
  if (node && newRange && selection) {
    newRange.setEnd(node, offset);
    if (!options.extendSelection) newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};
