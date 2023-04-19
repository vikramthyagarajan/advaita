import { ScreenPosition } from "modules/core/foundation";
import { Node } from "modules/state/project/ProjectTypes";
import { memo } from "react";
import ImageboxElement from "./ImageboxElement";
import MergeboxElement from "./MergeboxElement";
import ProseMirrorTextBox from "./ProseMirrorTextBox";

const ProjectNode = ({
  node,
  selected,
  cacheKey,
  screen,
}: {
  node: Node;
  selected: boolean;
  cacheKey: string;
  screen: ScreenPosition;
}) => {
  if (node.type === "textbox") {
    return (
      <ProseMirrorTextBox
        node={node}
        selected={selected}
        cacheKey={cacheKey}
        screen={screen}
      />
    );
  } else if (node.type === "mergebox") {
    return (
      <MergeboxElement
        node={node}
        selected={selected}
        cacheKey={cacheKey}
        screen={screen}
      />
    );
  } else if (node.type === "imagebox") {
    return (
      <ImageboxElement
        node={node}
        selected={selected}
        cacheKey={cacheKey}
        screen={screen}
      />
    );
  }
  return null;
};

export default memo(ProjectNode);
