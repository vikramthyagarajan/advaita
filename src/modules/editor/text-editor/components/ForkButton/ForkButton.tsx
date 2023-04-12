//@ts-nocheck
import ReactDOM from "react-dom";

import { Editor, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { FC } from "react";
import { MessageSquare, Save } from "react-feather";
import clsx from "clsx";

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
export const ForkButton: FC<any> = (props) => {
  const editor = useSlate();
  const { selection, children } = editor;
  const isVisible =
    selection &&
    ReactEditor.isFocused(editor) &&
    !Range.isCollapsed(selection) &&
    Editor.string(editor, selection) !== "";
  console.log(
    "isvisible",
    isVisible,
    selection,
    ReactEditor.isFocused(editor),
    Range.isCollapsed(selection),
    Editor.string(editor, selection)
  );

  return (
    <div
      className={clsx(
        "absolute right-[-30px] top-[40px] p-[3px] bg-slate-200 -translate-y-full rounded-t-sm cursor-pointer",
        {
          block: isVisible,
          hidden: !isVisible,
        }
      )}
    >
      <div>
        <MessageSquare></MessageSquare>
      </div>
    </div>
  );
};

export default ForkButton;
