import { faker } from "@faker-js/faker";
import { createBoardQuery } from "modules/core/network-utils";
import { generateId, generateProjectName } from "modules/core/project-utils";
import AppStore from "modules/state/AppStore";
import { Plus } from "react-feather";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const avatar = faker.image.avatar();
  const navigate = useNavigate();
  return (
    <div className="h-10 w-full bg-white border-b-[0.5px] border-slate-200">
      <div className="flex h-full w-full">
        <div className="flex-1 flex justify-start mr-auto items-center cursor-pointer">
          <img src="/new-logo-min.png" className="h-5 w-5 mr-1 ml-5" />
          <div className="font-bold text-lg">Advaita</div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {/* <div className="font-bold text-lg">Advaita</div> */}
        </div>
        <div className="flex-1 flex justify-end ml-auto items-center">
          <button
            className="bg-slate-800 text-white flex rounded-md px-2 py-1 mr-5"
            onClick={() => {
              AppStore.project.clearRegistry();
              const root = AppStore.project.___fetchState();
              const id = generateId();
              createBoardQuery(id, generateProjectName(), root);
              navigate(`/boards/${id}`);
            }}
          >
            <Plus className="mr-1"></Plus>
            <span>Create Board</span>
          </button>
          <img
            src={avatar}
            className="h-8 w-8 mr-5 rounded-full border border-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
