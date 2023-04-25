import CanvasStore from "./canvas/CanvasStore";
import ProjectStore from "./project/ProjectStore";
import TextEditorStore from "./text-editors/TextEditorStore";

export default class AppStore {
  private static _project: ProjectStore | null = null;
  private static _editors: TextEditorStore | null = null;
  static get canvas() {
    return CanvasStore;
  }

  static get project() {
    if (!this._project) this._project = new ProjectStore();
    return this._project;
  }

  static get editors() {
    if (!this._editors) this._editors = new TextEditorStore();
    return this._editors;
  }
}

// @ts-ignore
window.AppStore = AppStore;
