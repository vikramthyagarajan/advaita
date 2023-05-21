import { PRQuery } from "modules/core/NetworkTypes";
import { fetchPRQuery } from "modules/core/network-utils";
import { useEffect, useState } from "react";
import DiffViewer from "react-diff-viewer";

const renderDiff = (diff: string) => {
  return <div dangerouslySetInnerHTML={{ __html: diff }} />;
};

const usePRS = (id: string) => {
  const [prs, setPrs] = useState<PRQuery>();
  useEffect(() => {
    fetchPRQuery<PRQuery>(id).then((query) => {
      setPrs(query.data);
    });
  }, []);
  return prs;
};

const PRBlock = ({ documentId }: { documentId: string }) => {
  const prs = usePRS(documentId);
  if (!prs) return null;
  return (
    <div className="h-full w-full bg-white pt-5 px-5 flex flex-col">
      <h4>Reviews pending</h4>
      <div>
        {prs.children.map((child) => {
          return (
            <div className="flex-1 text-xs overflow-auto py-2">
              <DiffViewer
                oldValue={prs.document.body}
                newValue={child.body}
                splitView={false}
                hideLineNumbers={true}
                showDiffOnly={true}
                renderContent={renderDiff}
              ></DiffViewer>
              <div className="border-slate-500 border-2 rounded-md mt-5">
                <div className="p-5">
                  {child.comments.map((c) => {
                    return <div>{c.body}</div>;
                  })}
                </div>
                <div className="flex w-full">
                  <button className="bg-red-500 flex-1 py-2 rounded-bl-sm text-white text-md">
                    Reject
                  </button>
                  <button className="bg-green-600 flex-1 py-2 rounded-br-sm text-white text-md">
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PRBlock;
