//@ts-nocheck
import ReactDOM from "react-dom";

import { Editor, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { FC } from "react";
import { MessageSquare } from "react-feather";
import clsx from "clsx";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import AppStore from "modules/state/AppStore";
import { generateId } from "modules/core/project-utils";
import { getUserSelectionDiff } from "../../SlateUtils";
import { forkDocumentQuery } from "modules/core/network-utils";

export interface ForkButtonProps {
  nodeId: string;
}

/**
 * A hovering toolbar that is, a toolbar that appears over a selected text, and only when there is
 * a selection.
 *
 * If no children are provided it displays the following buttons:
 * Bold, italic, underline, strike through and code.
 *
 * Children will typically be `ToolbarButton`.
 */
export const ForkButton: FC<ForkButtonProps> = ({ nodeId }) => {
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
    selection
    // ReactEditor.isFocused(editor),

    // !Range.isCollapsed(selection),

    // Editor.string(editor, selection) !== ""
  );

  const onFork = () => {
    const node = AppStore.project.getNode(nodeId);
    if (!selection || !node) return;
    const position = { ...node.position };
    position.left += position.width + position.width / 2;
    position.top -= position.height / 2;
    const { original, diff } = getUserSelectionDiff(
      selection.anchor,
      selection.focus,
      children
    );
    const id = generateId();
    const connections = [...(node.connections || []), { id }];
    AppStore.project.setNode(node.id, {
      connections,
    });
    AppStore.project.addTextbox(id, { position });
    AppStore.project.setNode(id, {
      text: diff,
    });
    const forkedNode = AppStore.project.getNode(id);
    forkDocumentQuery({ id: nodeId, diff, original, forkedNode });
  };

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
        <MessageSquare onClick={() => onFork()}></MessageSquare>
      </div>
    </div>
  );
};

export default ForkButton;
