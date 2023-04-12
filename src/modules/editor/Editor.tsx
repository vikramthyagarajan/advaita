import useRenderLoop from "modules/core/RenderLoop";
import AppStore from "modules/state/AppStore";
import { useUiStore } from "modules/state/ui/UiStore";
import { useRef } from "react";
import CanvasRoot from "./CanvasRoot";
import { ElementInspector } from "./inspector/ElementInspector";
import WidgetDock from "./widgets/WidgetDock";
import { Xwrapper } from "react-xarrows";

const Editor = () => {
  const { widget, selectedNode: selected, selectedChild } = useUiStore();
  const rootRef = useRef<HTMLDivElement>(null);
  const frame = useRenderLoop(60);
  const selectedNode =
    selected !== null ? AppStore.project.getNode(selected) : null;
  const cacheKey = selectedNode?.cacheKey || null;

  return (
    <div className="w-full h-full relative" ref={rootRef}>
      <Xwrapper>
        <CanvasRoot frame={frame} />
        <WidgetDock selectedWidget={widget} />
        <ElementInspector
          selectedNode={selected}
          cacheKey={cacheKey}
          selectedChild={selectedChild}
        />
      </Xwrapper>
    </div>
  );
};

export default Editor;
