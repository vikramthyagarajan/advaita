import CanvasRoot from "./CanvasRoot";
import WidgetDock from "./widgets/WidgetDock";

const Editor = () => {
  return (
    <div className="w-full h-full">
      <CanvasRoot />
      <WidgetDock />
    </div>
  );
};

export default Editor;
