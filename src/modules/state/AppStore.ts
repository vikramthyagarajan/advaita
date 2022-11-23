import CanvasStore from "./canvas/CanvasStore";
import ProjectStore from "./project/ProjectStore";
import UiStore from "./ui/UiStore";

export default class AppStore {
  static get canvas() {
    return CanvasStore;
  }

  static get project() {
    return ProjectStore;
  }

  static get ui() {
    return UiStore;
  }
}
