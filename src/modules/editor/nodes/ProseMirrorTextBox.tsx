import { ScreenPosition } from "modules/core/foundation";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { memo, useRef } from "react";
import { BoxNode } from "./BoxNode";
import BoxActions from "./BoxActions";
import clsx from "clsx";
import Xarrow from "react-xarrows";
import ProseMirrorEditor from "../prose-mirror/ProseMirrorEditor";

const TextElement = ({ node }: { node: TextboxNode; cacheKey: string }) => {
  return (
    <div className="h-full w-full">
      <ProseMirrorEditor node={node}></ProseMirrorEditor>
    </div>
  );
};

const TextboxElement = ({
  node,
  selected,
  cacheKey,
  screen,
}: {
  node: TextboxNode;
  screen: ScreenPosition;
  selected: boolean;
  cacheKey: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
      actions={() => <BoxActions id={node.id} elementRef={ref} />}
    >
      <div
        ref={ref}
        id={node.id}
        data-id={node.id}
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2",
          {
            "shadow-lg": selected,
          }
        )}
      >
        {node.text ? <TextElement node={node} cacheKey={cacheKey} /> : null}
      </div>
      {node.connections
        ? node.connections.map((connection, index) => {
            return (
              <Xarrow key={index} start={node.id} end={connection.id}></Xarrow>
            );
          })
        : null}
    </BoxNode>
  );
};

export default memo(TextboxElement);
