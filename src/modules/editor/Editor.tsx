import useRenderLoop from "modules/core/RenderLoop";
import AppStore from "modules/state/AppStore";
import { useUiStore } from "modules/state/ui/UiStore";
import { useEffect, useRef } from "react";
import CanvasRoot from "./CanvasRoot";
import { ElementInspector } from "./inspector/ElementInspector";
import WidgetDock from "./widgets/WidgetDock";

const Editor = () => {
  const { widget, selected } = useUiStore();
  const rootRef = useRef<HTMLDivElement>(null);
  const frame = useRenderLoop(60);
  const selectedNode =
    selected !== null ? AppStore.project.getNode(selected) : null;
  const cacheKey = selectedNode?.cacheKey || null;

  return (
    <div className="w-full h-full relative" ref={rootRef}>
      <CanvasRoot frame={frame} />
      <WidgetDock selectedWidget={widget} />
      <ElementInspector selectedNode={selected} cacheKey={cacheKey} />
    </div>
  );
};

export default Editor;
