import { ScreenPosition } from "modules/core/foundation";
import { Node } from "modules/state/project/ProjectTypes";
import { memo } from "react";
import MergeboxElement from "./MergeboxElement";
import TextboxElement from "./TextboxElement";

const ProjectNode = ({
  node,
  selected,
  cacheKey,
  screen,
  viewOnly,
}: {
  node: Node;
  selected: boolean;
  cacheKey: string;
  screen: ScreenPosition;
  viewOnly?: boolean;
}) => {
  if (node.type === "textbox") {
    return (
      <TextboxElement
        node={node}
        selected={selected}
        cacheKey={cacheKey}
        screen={screen}
        viewOnly={viewOnly}
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
  }
  return null;
};

export default memo(ProjectNode);
