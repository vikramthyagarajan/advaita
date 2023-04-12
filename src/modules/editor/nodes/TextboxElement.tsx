import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import {
  ImageNode,
  TextboxNode,
  TextNode,
} from "modules/state/project/ProjectTypes";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import { Descendant } from "slate";
import MainEditor, { createGraspEditor } from "../text-editor/MainEditor";
import {
  CustomEditor,
  initialSlateMarkdown,
  initialSlateValue,
} from "../text-editor/slateTypes";
import { toSlate } from "../text-editor/SlateUtils";

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
  const [value, setValue] = useState<string>(initialSlateMarkdown());
  const [slate, setSlate] = useState<Descendant[]>([]);
  useEffect(() => {
    console.log("setting slate", toSlate(value));
    setSlate(toSlate(value));
  }, [value]);
  const mainEditorRef = useRef<CustomEditor>();
  if (!mainEditorRef.current)
    mainEditorRef.current = createGraspEditor(node.id);
  const onEditorChange = useCallback(() => {
    console.log("on editor change");
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
                value={slate}
                setValue={setSlate}
              />
            );
          })}
      </div>
    </BoxNode>
  );
};

export default memo(TextboxElement);
