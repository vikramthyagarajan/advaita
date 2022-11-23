import { memo } from "react";
import { MousePointer, PlusSquare } from "react-feather";

export const WidgetDock = () => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-200 px-4 py-2 rounded-t-lg">
      <div className="flex gap-2">
        <div className="p-2 bg-slate-300 rounded-md">
          <MousePointer />
        </div>
        <div className="p-2 bg-slate-200 rounded-md">
          <PlusSquare />
        </div>
      </div>
    </div>
  );
};

export default memo(WidgetDock);
