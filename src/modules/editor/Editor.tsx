import { useUiStore } from "modules/state/ui/UiStore";
import CanvasRoot from "./CanvasRoot";
import WidgetDock from "./widgets/WidgetDock";

const Editor = () => {
  const { widget } = useUiStore();
  return (
    <div className="w-full h-full">
      <CanvasRoot />
      <WidgetDock selectedWidget={widget} />
    </div>
  );
};

export default Editor;
