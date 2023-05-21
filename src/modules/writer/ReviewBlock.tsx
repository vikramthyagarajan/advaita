import { memo, useState } from "react";
import { Document } from "modules/core/NetworkTypes";
import DiffViewer from "react-diff-viewer";
import { addCommentQuery } from "modules/core/network-utils";
import { generateId, getAuthorId } from "modules/core/project-utils";

const renderDiff = (diff: string) => {
  return <div dangerouslySetInnerHTML={{ __html: diff }} />;
};

const ReviewBlock = ({
  document,
  parent,
  documentId,
}: {
  documentId: string;
  document: string;
  parent: string;
}) => {
  const [comment, setComment] = useState("");
  return (
    <div className="h-full w-full bg-white pt-5 px-5 flex flex-col">
      <h4>Your Edits</h4>
      <div className="flex-1 text-xs overflow-auto py-2">
        <DiffViewer
          oldValue={parent}
          newValue={document}
          splitView={false}
          hideLineNumbers={true}
          showDiffOnly={true}
          renderContent={renderDiff}
        ></DiffViewer>
      </div>
      <div className="h-[200px] relative self-end w-full mb-2">
        <textarea
          className="w-full h-full border border-slate-300 rounded-md p-2 resize-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="absolute left-0 bottom-0 right-0 bg-slate-800 text-white rounded-b-md rounded-t-none py-2 text-center inline-block"
          value={comment}
          onClick={() => {
            addCommentQuery(documentId, {
              text: comment,
              author: getAuthorId() || "",
              createdAt: Date.now(),
              id: generateId(),
            });
          }}
        >
          Comment and send for review
        </button>
      </div>
    </div>
  );
};

export default memo(ReviewBlock);
