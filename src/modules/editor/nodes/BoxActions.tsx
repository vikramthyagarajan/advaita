import { Save, SaveOutlined } from "@mui/icons-material";
import { exportElementAsImage } from "modules/core/export-utils";
import { RefObject } from "react";

const BoxActions = ({
  id,
  elementRef,
}: {
  id: string;
  elementRef: RefObject<HTMLElement>;
}) => {
  return (
    <div className="absolute right-4 top-0 p-[3px] bg-slate-200 -translate-y-full rounded-t-sm cursor-pointer">
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
