import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import {
  ImageNode,
  TextboxNode,
  TextNode,
} from "modules/state/project/ProjectTypes";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import { Descendant } from "slate";
import MainEditor, { createGraspEditor } from "../text-editor/MainEditor";
import {
  CustomEditor,
  initialSlateMarkdown,
  initialSlateValue,
} from "../text-editor/slateTypes";
import { toJsx, toMd, toSlate } from "../text-editor/SlateUtils";
import Xarrow from "react-xarrows";
import ForkButton from "../text-editor/components/ForkButton/ForkButton";
import { saveDocumentQuery } from "modules/core/network-utils";

const TextElement = ({ node }: { node: TextboxNode; cacheKey: string }) => {
  const value = node.text;
  const [slate, setSlate] = useState<Descendant[]>(toSlate(value));
  const [_, setFakeState] = useState<Descendant[]>([]);
  const mainEditor = useRef<CustomEditor>();
  if (!mainEditor.current) mainEditor.current = createGraspEditor(node.id);
  const topEditor = useRef<CustomEditor>();
  if (!topEditor.current) topEditor.current = createGraspEditor(node.id);
  const bottomEditor = useRef<CustomEditor>();
  if (!bottomEditor.current) bottomEditor.current = createGraspEditor(node.id);
  const onEditorChange = useCallback((slate) => {
    const markdown = toMd(slate);
    AppStore.project.setNode(node.id, {
      text: markdown,
    });
  }, []);
  const onMidEditorChange = useCallback((nodes) => {
    const range = node.selection || [0, 0];
    const preNodes = slate.slice(0, range[0]);
    const postNodes = slate.slice(range[1] + 1);
    const markdown = toMd([...preNodes, ...nodes, ...postNodes]);
    AppStore.project.setNode(node.id, {
      text: markdown,
    });
  }, []);
  const onFakeEditorChange = useCallback(() => {}, []);
  const onBlur = useCallback(() => {
    saveDocumentQuery(node.id, node);
  }, []);
  const selection = node.selection || [0, 0];
  const preNodes = useMemo(() => [...slate.slice(0, selection[0])], [node.id]);
  const nodes: Descendant[] = useMemo(
    () => slate.slice(selection[0], selection[1] + 1),
    [node.id]
  );
  const postNodes = useMemo(() => [...slate.slice(selection[1] + 1)], []);

  if (node.selection) {
    // console.log("got nodes", preNodes, nodes, postNodes);
    return (
      <div className="w-full h-full">
        <div className="text-gray-300">
          <MainEditor
            nodeId={node.id + "top"}
            onEditorChange={onFakeEditorChange}
            editor={topEditor.current}
            value={preNodes}
            setValue={setFakeState}
            onBlur={onBlur}
            readOnly
          />
        </div>
        <MainEditor
          nodeId={node.id}
          onEditorChange={onMidEditorChange}
          editor={mainEditor.current}
          value={nodes}
          setValue={setSlate}
          onBlur={onBlur}
        ></MainEditor>
        <div className="text-gray-300">
          <MainEditor
            nodeId={node.id + "bot"}
            onEditorChange={onFakeEditorChange}
            editor={bottomEditor.current}
            value={postNodes}
            setValue={setFakeState}
            onBlur={onBlur}
            readOnly
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full">
        <MainEditor
          nodeId={node.id}
          onEditorChange={onEditorChange}
          editor={mainEditor.current}
          value={slate}
          setValue={setSlate}
          onBlur={onBlur}
        ></MainEditor>
      </div>
    );
  }
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
