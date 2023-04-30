import Markdown from "markdown-to-jsx";
import { memo } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

const Document = ({ document }: { document: string }) => {
  return (
    <div className="w-[300px] border border-slate-400 rounded-lg p-5 relative flex flex-col">
      <Markdown className="mb-5">{document}</Markdown>
      <button className="w-full py-5 bg-slate-950 text-white rounded-xl mt-auto">
        Use this version
      </button>
    </div>
  );
};

const DocumentVersions = () => {
  const { documents } = useLoaderData() as { documents: string[] };
  const navigate = useNavigate();

  return (
    <div
      className="fixed left-0 top-0 h-full w-full bg-slate-700 flex items-center justify-center"
      onClick={(e) => {
        navigate(-1);
      }}
    >
      <div
        className="h-[60vh] w-[1000px] bg-white rounded-3xl overflow-auto"
        onPointerDown={(e) => e.preventDefault()}
      >
        <div className="h-full w-full flex flex-wrap gap-5 p-5">
          {documents.map((d, i) => {
            return <Document key={i} document={d} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(DocumentVersions);
