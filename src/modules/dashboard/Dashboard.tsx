import {
  generateId,
  generateName,
  generateProjectName,
  getUser,
} from "modules/core/project-utils";
import { Edit2 } from "react-feather";
import Notifications from "./Notifications";
import DashboardHeader from "./DashboardHeader";
import AppStore from "modules/state/AppStore";
import { useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Document, User } from "modules/core/NetworkTypes";

type Board = {
  name: string;
  image: string;
  id: string;
  uuid: string;
};

interface BoardProps {
  board: Board;
}

const images = [
  "https://res.cloudinary.com/diglgjher/image/upload/v1682674505/boards/25065f8d-d971-48b0-b1c5-0333d97f0154.png",
  "https://res.cloudinary.com/diglgjher/image/upload/v1682674497/boards/8c653bf5-9789-46cc-b10d-4adb34296517.png",
  "https://res.cloudinary.com/diglgjher/image/upload/v1682675049/boards/b2ccbfc9-a354-465f-a574-cd7fbdd2de84.png",
  "https://res.cloudinary.com/diglgjher/image/upload/v1682675043/boards/52069cc5-ff79-49c3-b60e-8d422d0edade.png",
  "https://res.cloudinary.com/diglgjher/image/upload/v1682587980/boards/9ad8a850-48bf-4dd0-93b9-fef6d25a4a74.png",
  "https://res.cloudinary.com/diglgjher/image/upload/v1682675043/boards/52069cc5-ff79-49c3-b60e-8d422d0edade.png",
];

const generateFakeData = (): Board[] => {
  const images = [
    "https://res.cloudinary.com/diglgjher/image/upload/v1682674505/boards/25065f8d-d971-48b0-b1c5-0333d97f0154.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682674497/boards/8c653bf5-9789-46cc-b10d-4adb34296517.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682675049/boards/b2ccbfc9-a354-465f-a574-cd7fbdd2de84.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682675043/boards/52069cc5-ff79-49c3-b60e-8d422d0edade.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682587980/boards/9ad8a850-48bf-4dd0-93b9-fef6d25a4a74.png",
  ];
  return images.map((img) => ({
    id: generateId(),
    name: generateProjectName(),
    image: img,
    uuid: generateId(),
  }));
};

const Board = ({ board }: BoardProps) => {
  const random = Math.round(Math.random() * 5);
  const url = `https://res.cloudinary.com/diglgjher/image/upload/boards/${board.uuid}.png`; //images[random];
  return (
    <Link
      className="rounded-md border border-slate-400 w-[200px] cursor-pointer overflow-hidden shadow-sm"
      to={`/boards/${board.uuid}`}
    >
      <img src={url} className="w-[200px] h-[200px]"></img>
      <div className="flex bg-white px-2 py-4 rounded-b-md items-start gap-1">
        <Edit2 width={20} height={20} className="mt-1 w-5 h-5"></Edit2>
        <div className="text-sm capitalize text-ellipsis font-[200] flex-1">
          {board.name}
        </div>
      </div>
    </Link>
  );
};

interface BoardsProps {
  boards: Board[];
}

const Boards = ({ boards }: BoardsProps) => {
  return (
    <div className=" flex flex-wrap gap-5 p-5">
      {boards.map((b) => (
        <Board key={b.id} board={b} />
      ))}
    </div>
  );
};

const DraftCards = ({ drafts }: { drafts: Document[] }) => {
  return (
    <div className=" flex flex-wrap gap-5 p-5">
      {drafts.map((d) => (
        <Link
          className="rounded-md border border-slate-400 w-[200px] cursor-pointer overflow-hidden shadow-sm"
          to={`/drafts/${d.uuid}`}
        >
          <div className="w-[200px] h-[200px] bg-slate-400"></div>
          <div className="flex bg-white px-2 py-4 rounded-b-md items-start gap-1">
            <Edit2 width={20} height={20} className="mt-1 w-5 h-5"></Edit2>
            <div className="text-sm capitalize text-ellipsis font-[200] flex-1">
              {d.title}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export interface DashboardProps {}
const Dashboard = (props: DashboardProps) => {
  const { user, boards, documents } = useLoaderData() as {
    user: User;
    boards: { mine: Board[]; visited: Board[] };
    documents: Document[];
  };
  useEffect(() => {
    const user = getUser();
    if (user) AppStore.project.user = user;
  }, []);
  const ownBoards = boards.mine;
  const otherBoards = boards.visited;
  console.log("docss", documents);

  return (
    <div className="h-full w-full bg-slate-200 overflow-hidden flex">
      <div className="overflow-scroll">
        <DashboardHeader avatar={user?.avatar || ""} />
        <div className="grid grid-cols-[2fr_1fr]">
          <div className="p-5 flex flex-col gap-5">
            <div className="rounded-3xl bg-white py-5">
              <div className="mx-5 mb-2 font-semibold text-2xl">
                Your Boards
              </div>
              <div className="border-[0.5px] border-slate-300"></div>
              <Boards boards={ownBoards} />
            </div>
            <div className="rounded-3xl bg-white py-5">
              <div className="mx-5 mb-2 font-semibold text-2xl">
                Your drafts
              </div>
              <div className="border-[0.5px] border-slate-300"></div>
              <DraftCards drafts={documents || []} />
            </div>
          </div>
          <div className="p-5">
            <div className="rounded-3xl bg-white py-5">
              <div className="mx-5 mb-2 font-semibold text-2xl">
                Notifications
              </div>
              <div className="border-[0.5px] border-slate-300 mb-5"></div>
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
