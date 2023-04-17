import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import { MergeboxNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { memo, useRef, useState } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import DiffViewer from "react-diff-viewer";
import Markdown from "markdown-to-jsx";
import { Check, CornerDownLeft } from "react-feather";
import { onCommentAdd } from "../text-editor/SlateUtils";
import { getAuthorId } from "modules/core/project-utils";
import { acceptMergeDocumentQuery } from "modules/core/network-utils";

const MergeActions = ({ id }: { id: string }) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  return (
    <div className="absolute right-4 top-0 p-[3px] bg-slate-200 -translate-y-full rounded-t-sm cursor-pointer">
      <div className={clsx("", {})}>
        <Check
          onClick={async () => {
            const node = AppStore.project.getNode(id) as MergeboxNode;
            const parent = JSON.parse(
              JSON.stringify(AppStore.project.getNode(node.parent))
            ) as TextboxNode;
            const child = JSON.parse(
              JSON.stringify(AppStore.project.getNode(node.child))
            ) as TextboxNode;
            const { document } = await acceptMergeDocumentQuery(child.id);
            // AppStore.project.removeNode(node.id);
            // AppStore.project.removeNode(parent.id);
            // setTimeout(() => {
            //   const newNode = {
            //     ...document.metadata.node,
            //   };
            //   AppStore.project.registry.addNode({ ...newNode });
            // }, 1000);
          }}
        ></Check>
      </div>
    </div>
  );
};

const renderDiff = (markdown: string) => {
  return <Markdown>{markdown}</Markdown>;
};

const Comment = ({
  commentId,
  text,
  author,
}: {
  commentId: string;
  text: string;
  author: string;
}) => {
  return (
    <div className="my-3 flex gap-2">
      <div className="w-[50px] h-[50px]">
        <img
          src={`https://robohash.org/${author}`}
          className="w-full h-full rounded-full"
        />
      </div>
      <div>{text}</div>
    </div>
  );
};

const CommentInput = ({ nodeId }: { nodeId: string }) => {
  const [value, setValue] = useState("");

  return (
    <div className="h-[100px] w-full rounded-md border-gray-300 border p-3 relative">
      <textarea
        className="h-full w-full outline-none resize-none"
        placeholder="Type your comment here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      <button
        className="p-2 absolute right-0 bottom-0 bg-gray-200 rounded-md opacity-50 hover:opacity-100"
        onClick={() => {
          setValue("");
          onCommentAdd({
            mergeboxId: nodeId,
            text: value,
            author: getAuthorId() || "",
          });
        }}
      >
        <CornerDownLeft className="border-inherit" />
      </button>
    </div>
  );
};

const CommentSection = ({ nodeId }: { nodeId: string }) => {
  const node = AppStore.project.getNode(nodeId) as MergeboxNode;
  const comments = node.comments.sort((a, b) => a.createdAt - b.createdAt);
  return (
    <div className="mt-3">
      <CommentInput nodeId={nodeId} />
      <div>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              commentId={comment.id}
              text={comment.text}
              author={comment.author}
            />
          );
        })}
      </div>
    </div>
  );
};

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

  if (!parentNode || !childNode) return <div></div>;

  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
      actions={() => <MergeActions id={node.id} />}
    >
      <div
        id={node.id}
        data-id={node.id}
        className={clsx(
          "flex flex-col border-2 rounded-lg w-full h-full select-none p-2 overflow-hidden",
          {
            "shadow-lg": selected,
          }
        )}
      >
        <DiffViewer
          oldValue={parentNode.text}
          newValue={childNode.text}
          splitView={true}
          renderContent={renderDiff}
        ></DiffViewer>
        <CommentSection nodeId={node.id} />
      </div>
    </BoxNode>
  );
};

export default memo(MergeboxElement);
