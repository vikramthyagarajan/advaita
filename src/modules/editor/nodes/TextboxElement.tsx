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
import { toMd, toSlate } from "../text-editor/SlateUtils";
import Xarrow from "react-xarrows";
import ForkButton from "../text-editor/components/ForkButton/ForkButton";
import { saveDocumentQuery } from "modules/core/network-utils";

const TextElement = ({ node }: { node: TextboxNode; cacheKey: string }) => {
  // const [value, setValue] = useState(initialSlateMarkdown());
  const value = node.text;
  const [slate, setSlate] = useState<Descendant[]>(toSlate(value));
  useEffect(() => {
    console.log("stting slate", value, toSlate(value));
    setSlate(toSlate(value));
  }, [value]);
  // console.log("slate i", slate);
  const mainEditor = useRef<CustomEditor>();
  if (!mainEditor.current) mainEditor.current = createGraspEditor(node.id);
  const onEditorChange = useCallback((slate) => {
    const markdown = toMd(slate);
    AppStore.project.setNode(node.id, {
      text: markdown,
    });
  }, []);
  const onBlur = useCallback(() => {
    saveDocumentQuery(node.id, node);
  }, []);
  return (
    <div className="w-full h-full">
      <MainEditor
        editorKey={node.id}
        onEditorChange={onEditorChange}
        editor={mainEditor.current}
        value={slate}
        setValue={setSlate}
        onBlur={onBlur}
      >
        {/* <ForkButton /> */}
      </MainEditor>
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
