import clsx from "clsx";
import { Widget } from "modules/state/ui/UiState";
import { memo } from "react";
import { Icon, MousePointer, PlusSquare, Image, Video } from "react-feather";

export const WidgetDock = ({ selectedWidget }: { selectedWidget: Widget }) => {
  const widgets: { name: Widget; icon: Icon }[] = [
    { name: "pointer", icon: MousePointer },
    { name: "textbox", icon: PlusSquare },
    { name: "image", icon: Image },
    { name: "video", icon: Video },
  ];
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-200 px-4 py-2 rounded-t-lg">
      <div className="flex gap-2">
        {widgets.map((widget) => (
          <div
            className={clsx("p-2 rounded-md", {
              "bg-slate-300": widget.name === selectedWidget,
            })}
          >
            <widget.icon />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WidgetDock);
