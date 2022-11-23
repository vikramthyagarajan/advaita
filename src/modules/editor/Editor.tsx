import AppStore from "modules/state/AppStore";
import CanvasRoot from "./CanvasRoot";
import WidgetDock from "./widgets/WidgetDock";

const Editor = () => {
  const widget = AppStore.ui.widget;
  return (
    <div className="w-full h-full">
      <CanvasRoot />
      <WidgetDock selectedWidget={widget} />
    </div>
  );
};

export default Editor;
