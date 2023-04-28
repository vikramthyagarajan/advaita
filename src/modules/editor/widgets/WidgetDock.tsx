import React from "react";
import clsx from "clsx";
import { Widget } from "modules/state/ui/UiState";
import { getUiDispatch } from "modules/state/ui/UiStore";
import { memo, useRef } from "react";
import { Icon, MousePointer, PlusSquare, Image, Video } from "react-feather";

export const WidgetDock = ({ selectedWidget }: { selectedWidget: Widget }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uiDispatch = getUiDispatch();
  const widgets: { name: Widget; icon: Icon }[] = [
    { name: "pointer", icon: MousePointer },
    { name: "textbox", icon: PlusSquare },
  ];
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-200 px-4 py-2 rounded-t-lg">
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (!file) return;
          const fr = new FileReader();
          fr.readAsArrayBuffer(file);
          fr.onload = function () {
            // you can keep blob or save blob to another position
            if (!fr.result) return;
            const blob = new Blob([fr.result]);
            const url = URL.createObjectURL(blob);
            const dispatch = getUiDispatch();
            dispatch({ type: "urlPreviewUpdated", url });
          };
        }}
      />
      <div className="flex gap-2">
        {widgets.map((widget) => (
          <div
            key={widget.name}
            className={clsx("p-2 rounded-md cursor-pointer", {
              "bg-slate-400": widget.name === selectedWidget,
            })}
            onClick={() => {
              if (widget.name === "image" || widget.name === "video") {
                inputRef.current?.click();
              }
              uiDispatch({ type: "widgetUpdated", widget: widget.name });
            }}
          >
            <widget.icon />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WidgetDock);
