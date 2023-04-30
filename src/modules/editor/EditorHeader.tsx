import { faker } from "@faker-js/faker";
import AppStore from "modules/state/AppStore";
import { memo } from "react";
import { Save } from "react-feather";

export type EditorHeaderProps = {
  avatar: string;
  projectName: string;
};

const EditorHeader = ({ avatar, projectName }: EditorHeaderProps) => {
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
          <img
            src={avatar}
            className="h-8 w-8 mr-5 rounded-full border border-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(EditorHeader);
