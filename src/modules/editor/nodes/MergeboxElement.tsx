import clsx from "clsx";
import { ScreenPosition } from "modules/core/foundation";
import AppStore from "modules/state/AppStore";
import { MergeboxNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { memo, useRef, useState } from "react";
import BoxActions from "./BoxActions";
import { BoxNode } from "./BoxNode";
import DiffViewer from "react-diff-viewer";
import Markdown from "markdown-to-jsx";
import { CornerDownLeft } from "react-feather";
import { onCommentAdd } from "../text-editor/SlateUtils";
import { getAuthorId } from "modules/core/project-utils";

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
      <button className="p-2 absolute right-0 bottom-0 bg-gray-200 rounded-md opacity-50 hover:opacity-100">
        <CornerDownLeft
          className="border-inherit"
          onClick={() => {
            onCommentAdd({
              mergeboxId: nodeId,
              text: value,
              author: getAuthorId() || "",
            });
          }}
        />
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

  return (
    <BoxNode
      id={node.id}
      cacheKey={cacheKey}
      position={node.position}
      screen={screen}
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
