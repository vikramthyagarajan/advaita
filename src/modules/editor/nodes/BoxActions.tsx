import { Save, SaveOutlined } from "@mui/icons-material";
import clsx from "clsx";
import { exportElementAsImage } from "modules/core/export-utils";
import AppStore from "modules/state/AppStore";
import { TextboxNode } from "modules/state/project/ProjectTypes";
import { RefObject } from "react";
import { GitMerge } from "react-feather";
import { onMergeDocument } from "../prose-mirror/SlateUtils";

const BoxActions = ({
  id,
  elementRef,
}: {
  id: string;
  elementRef: RefObject<HTMLElement>;
}) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  return (
    <div className="absolute right-4 top-0 p-[3px] bg-slate-200 -translate-y-full rounded-t-sm cursor-pointer">
      <div
        className={clsx("", {
          block: node.selection,
          hidden: !node.selection,
        })}
      >
        <GitMerge onClick={() => onMergeDocument(id)}></GitMerge>
      </div>
      {/* <div
        onClick={(e) => {
          e.preventDefault();
          if (elementRef.current)
            exportElementAsImage(elementRef.current, { name: `element-${id}` });
        }}
      >
        <Save></Save>
      </div> */}
    </div>
  );
};

export default BoxActions;
