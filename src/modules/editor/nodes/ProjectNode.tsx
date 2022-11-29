import { ScreenPosition } from "modules/core/foundation";
import { Node } from "modules/state/project/ProjectRegistry";
import { memo } from "react";
import TextboxElement from "./TextboxElement";

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
      <TextboxElement
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
