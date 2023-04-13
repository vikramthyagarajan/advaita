import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import { MergeboxNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { memo, useRef } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import DiffViewer from "react-diff-viewer";

const MergeboxElement = ({
  node,
  selected,
  cacheKey,
  screen,
}: {
  node: MergeboxNode;
  screen: ScreenPosition;
  selected: boolean;
  cacheKey: string;
}) => {
  const parentNode = AppStore.project.getNode(node.parent) as TextboxNode;
  const childNode = AppStore.project.getNode(node.child) as TextboxNode;

  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
    >
      <div
        id={node.id}
        data-id={node.id}
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2",
          {
            "shadow-lg": selected,
          }
        )}
      >
        <DiffViewer
          oldValue={parentNode.text}
          newValue={childNode.text}
          splitView={true}
        ></DiffViewer>
      </div>
    </BoxNode>
  );
};

export default memo(MergeboxElement);
