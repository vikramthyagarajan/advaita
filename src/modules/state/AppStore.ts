import CanvasStore from "./canvas/CanvasStore";
import ProjectStore from "./project/ProjectStore";

export default class AppStore {
  static get canvas() {
    return CanvasStore;
  }

  static get project() {
    return ProjectStore;
  }
}
