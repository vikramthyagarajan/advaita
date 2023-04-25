import { ScreenPosition } from "modules/core/foundation";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { memo, useRef } from "react";
import { BoxNode } from "./BoxNode";
import BoxActions from "./BoxActions";
import clsx from "clsx";
import ProseMirrorEditor from "../prose-mirror/ProseMirrorEditor";
import { TextboxMenu } from "../prose-mirror/TextboxMenu";
import Markdown from "markdown-to-jsx";
import useResizeObserver from "use-resize-observer";
import AppStore from "modules/state/AppStore";
import { defaultMarkdownSerializer } from "prosemirror-markdown";
import { syncNodeWithEditorValue } from "../prose-mirror/SlateUtils";

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
  const { ref: containerRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width, height }) => {
      if (height && height >= node.position.height - 20) {
        AppStore.project.setNode(node.id, {
          position: { ...node.position, height: height + 50 },
        });
      }
    },
  });
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
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2 z-10",
          {
            "shadow-lg": selected,
          }
        )}
      >
        <div ref={containerRef}>
          {node.preText ? (
            <div className="text-gray-300 pb-5">
              <Markdown>{node.preText}</Markdown>
            </div>
          ) : null}
          {node.text ? (
            <div>
              <TextElement node={node} cacheKey={cacheKey} />
            </div>
          ) : null}
          {node.postText ? (
            <div className="text-gray-300 pt-5">
              <Markdown>{node.postText}</Markdown>
            </div>
          ) : null}
        </div>
      </div>
    </BoxNode>
  );
};

export default memo(TextboxElement);
