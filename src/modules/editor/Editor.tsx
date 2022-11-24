import { useUiStore } from "modules/state/ui/UiStore";
import { useEffect, useRef } from "react";
import CanvasRoot from "./CanvasRoot";
import WidgetDock from "./widgets/WidgetDock";

const Editor = () => {
  const { widget } = useUiStore();
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full h-full relative" ref={rootRef}>
      <CanvasRoot />
      <WidgetDock selectedWidget={widget} />
    </div>
  );
};

export default Editor;
