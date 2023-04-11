import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import {
  ImageNode,
  TextboxNode,
  TextNode,
} from "modules/state/project/ProjectTypes";
import { memo, useCallback, useRef, useState } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import { Descendant } from "slate";
import MainEditor, { createGraspEditor } from "../text-editor/MainEditor";
import { CustomEditor, initialSlateValue } from "../text-editor/slateTypes";

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
  const [value, setValue] = useState<Descendant[]>(initialSlateValue());
  const mainEditorRef = useRef<CustomEditor>();
  if (!mainEditorRef.current)
    mainEditorRef.current = createGraspEditor(node.id);
  const onEditorChange = useCallback(() => {
    setValue(value);
  }, [value]);
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
        data-id={node.id}
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2",
          {
            "shadow-lg": selected,
          }
        )}
      >
        {node.children
          .map((child, index) => ({
            val: AppStore.project.getNode(child.id) as
              | TextNode
              | ImageNode
              | null,
            child,
            index,
          }))
          // .filter(({ val }) => isPresent(val))
          .map(({ val, child, index }) => {
            const sub = val as TextNode;
            return (
              <MainEditor
                key={index}
                editorKey={sub.id}
                onEditorChange={onEditorChange}
                editor={mainEditorRef.current}
                value={value}
                setValue={setValue}
              />
            );
          })}
      </div>
    </BoxNode>
  );
};

export default memo(TextboxElement);
