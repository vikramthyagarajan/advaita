import clsx from "clsx";
import AppStore from "modules/state/AppStore";
import { Widget } from "modules/state/ui/UiState";
import { getUiDispatch } from "modules/state/ui/UiStore";
import { memo } from "react";
import { Icon, MousePointer, PlusSquare, Image, Video } from "react-feather";

export const WidgetDock = ({ selectedWidget }: { selectedWidget: Widget }) => {
  const uiDispatch = getUiDispatch();
  const widgets: { name: Widget; icon: Icon }[] = [
    { name: "pointer", icon: MousePointer },
    { name: "textbox", icon: PlusSquare },
    { name: "image", icon: Image },
    { name: "video", icon: Video },
  ];
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-100 px-4 py-2 rounded-t-lg">
      <div className="flex gap-2">
        {widgets.map((widget) => (
          <div
            key={widget.name}
            className={clsx("p-2 rounded-md cursor-pointer", {
              "bg-slate-300": widget.name === selectedWidget,
            })}
            onClick={() =>
              uiDispatch({ type: "widgetUpdated", widget: widget.name })
            }
          >
            <widget.icon />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WidgetDock);
