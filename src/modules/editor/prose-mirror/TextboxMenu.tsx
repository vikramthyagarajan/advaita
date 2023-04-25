import ListIcon from "@mui/icons-material/List";
import ListNumbered from "@mui/icons-material/FormatListNumbered";
import {
  Bold,
  CornerUpLeft,
  CornerUpRight,
  Image,
  Italic,
  Link,
  List,
  RotateCcw,
  RotateCw,
  Underline,
} from "react-feather";
import { toggleMark } from "prosemirror-commands";
import { Abc, TextFields, Title } from "@mui/icons-material";
import { schema } from "prosemirror-markdown";
import { EditorState, Transaction } from "prosemirror-state";
import AppStore from "modules/state/AppStore";

type ClickProps = {
  state: EditorState;
  dispatch: (tr: Transaction) => void;
};
const menuItems = [
  {
    id: "bold",
    icon: <Bold className="w-full " />,
    onClick: ({ state, dispatch }: ClickProps) => {
      const mark = schema.marks.strong;
      const cmd = toggleMark(mark);
      cmd(state, dispatch);
    },
  },
  {
    id: "italics",
    icon: <Italic className="w-full " />,
    onClick: () => {},
  },
  {
    id: "underline",
    icon: <Underline className="w-full " />,
    onClick: () => {},
  },
  {
    id: "link",
    icon: <Link className="w-full " />,
    onClick: () => {},
  },
  {
    id: "image",
    icon: <Image className="w-full " />,
    onClick: () => {},
  },
  {
    id: "divider-1",
    icon: <div className="h-full w-[1px] bg-gray-300"></div>,
    onClick: () => {},
  },
  {
    id: "text",
    icon: <Abc />,
    onClick: () => {},
  },
  {
    id: "heading-1",
    icon: <Title fontSize="medium" />,
    onClick: () => {},
  },
  {
    id: "heading-2",
    icon: <Title fontSize="small" />,
    onClick: () => {},
  },
  {
    id: "heading-3",
    icon: <Title fontSize="inherit" />,
    onClick: () => {},
  },
  {
    id: "list",
    icon: <List className="w-full" />,
    onClick: () => {},
  },
  {
    id: "list-numbered",
    icon: <ListNumbered className="w-full" />,
    onClick: () => {},
  },
  {
    id: "divider-2",
    icon: <div className="h-full w-[1px] bg-gray-300"></div>,
    onClick: () => {},
  },
  {
    id: "undo",
    icon: <RotateCcw className="w-full text-gray-300" />,
    onClick: () => {},
  },
  {
    id: "redo",
    icon: <RotateCw className="w-full text-gray-300" />,
    onClick: () => {},
  },
];

export const TextboxMenu = ({ nodeId }: { nodeId: string }) => {
  const state = AppStore.editors.getEditorState(nodeId);
  const view = AppStore.editors.getEditorView(nodeId);
  const dispatch = (tr: Transaction) => {
    AppStore.editors.updateEditorState(nodeId, tr);
  };
  if (!state) return null;
  return (
    <div className=" w-full flex border-b border-b-gray-300 text-sm pb-1">
      {menuItems.map(({ icon, id, onClick }) => (
        <div
          key={id}
          className="p-1 text-gray-700"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick({ state, dispatch });
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  );
};

export const buildTextboxMenu = () => {};
