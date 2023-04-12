//@ts-nocheck
import React from "react";
import { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import { Descendant, Editor, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { Box, Stack, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

/**
 * A hovering toolbar that is, a toolbar that appears over a selected text, and only when there is
 * a selection.
 *
 * If no children are provided it displays the following buttons:
 * Bold, italic, underline, strike through and code.
 *
 * Children will typically be `ToolbarButton`.
 */
export const ForkButton: FC<any> = ({ children, ...props }) => {
  const editor = useSlate();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const { selection, children } = editor;
    if (!selection) return;

    const range = [selection.anchor.path[0], selection.focus.path[0]];
    const nodes: Descendant[] = children.slice(range[0], range[1] + 1);
    console.log("selection", selection, nodes);

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      return;
    }
  });

  return <div>Comment here</div>;
};

export default ForkButton;
