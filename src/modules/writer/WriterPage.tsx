import { memo, useState } from "react";
import TextEditor from "./TextEditor";
import { useLoaderData } from "react-router-dom";
import {
  saveDocumentBodyQuery,
  saveDocumentQuery,
} from "modules/core/network-utils";
import { Document } from "modules/core/NetworkTypes";

export type EditorHeaderProps = {
  // avatar: string;
  projectName: string;
};

const EditorHeader = memo(({ projectName }: EditorHeaderProps) => {
  return (
    <div className="h-10 w-full bg-white border-b-[0.5px] border-slate-200">
      <div className="flex h-full w-full">
        <div className="flex-1 flex justify-start mr-auto items-center cursor-pointer">
          <img src="/new-logo-min.png" className="h-5 w-5 mr-1 ml-5" />
          <div className="font-bold text-lg">Advaita</div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="font-bold text-lg capitalize">{projectName}</div>
        </div>
        <div className="flex-1 flex justify-end ml-auto items-center">
          {/* <img
            src={avatar}
            className="h-8 w-8 mr-5 rounded-full border border-slate-500"
          /> */}
        </div>
      </div>
    </div>
  );
});

export const WriterPage = () => {
  const {
    draft: { document, parent },
  } = useLoaderData() as {
    draft: {
      document: Document;
      parent: Document | null;
    };
  };
  const [body, setBody] = useState(document.body);
  const setDocumentBody = (body: string) => {
    setBody(body);
    saveDocumentBodyQuery(document.uuid, body);
  };

  return (
    <div className="w-full h-full">
      <EditorHeader projectName={document.title} />
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <div className="w-[80%] h-full p-10">
          <TextEditor body={body} setBody={setDocumentBody} />
        </div>
      </div>
    </div>
  );
};

export default memo(WriterPage);
