import { generateId, generateName } from "modules/core/project-utils";
import { Edit2 } from "react-feather";

type Board = {
  name: string;
  image: string;
  id: string;
};

interface BoardProps {
  board: Board;
}

const generateFakeData = (): Board[] => {
  const images = [
    "https://res.cloudinary.com/diglgjher/image/upload/v1682588043/boards/d214ee09-776e-4b36-9437-e638dab59ff9.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682588042/boards/f49f3321-a244-4ba2-8203-0e5a93c8b1a9.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682588041/boards/d10c94c7-666f-4a99-99dd-c438b1466528.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682588028/boards/49984e1b-c794-4103-9c7c-a3c53b50fb98.png",
    "https://res.cloudinary.com/diglgjher/image/upload/v1682587980/boards/9ad8a850-48bf-4dd0-93b9-fef6d25a4a74.png",
  ];
  return images.map((img) => ({
    id: generateId(),
    name: generateName(),
    image: img,
  }));
};

const Board = ({ board }: BoardProps) => {
  return (
    <div className="rounded-md border border-slate-400 w-[200px] cursor-pointer">
      <img src={board.image} className="w-[200px] h-[200px] rounded-t-md"></img>
      <div className="flex bg-white px-2 py-4 rounded-b-md items-center gap-2">
        <Edit2 fontSize={14}></Edit2>
        <div className="text-xs capitalize text-ellipsis">{board.name}</div>
      </div>
    </div>
  );
};

interface BoardsProps {
  boards: Board[];
}

const Boards = ({ boards }: BoardsProps) => {
  return (
    <div className=" flex flex-wrap gap-5 p-5">
      {boards.map((b) => (
        <Board board={b} />
      ))}
    </div>
  );
};

export interface DashboardProps {}
const Dashboard = (props: DashboardProps) => {
  const ownBoards = generateFakeData();
  const otherBoards = generateFakeData();
  return (
    <div className="h-full w-full bg-slate-200 overflow-hidden flex">
      <div className="overflow-scroll">
        <div className="grid grid-cols-[2fr_1fr]">
          <div className="p-5 flex flex-col gap-5">
            <div className="rounded-3xl bg-white py-5">
              <div className="mx-5 mb-2 font-bold text-2xl">Your Boards</div>
              <div className="border border-slate-300"></div>
              <Boards boards={ownBoards} />
            </div>
            <div className="rounded-3xl bg-white py-5">
              <div className="mx-5 mb-2 font-bold text-2xl">
                Boards You've Viewed
              </div>
              <div className="border border-slate-300"></div>
              <Boards boards={otherBoards} />
            </div>
          </div>
          <div className="p-5">
            <div className="rounded-3xl bg-white py-5">
              <div className="mx-5 mb-2 font-bold text-2xl">Notifications</div>
              <div className="border border-slate-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
