import CanvasStore from "./canvas/CanvasStore";
import ProjectStore from "./project/ProjectStore";

export default class AppStore {
  private static _project: ProjectStore | null = null;
  static get canvas() {
    return CanvasStore;
  }

  static get project() {
    if (!this._project) this._project = new ProjectStore();
    return this._project;
  }
}
