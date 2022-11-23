import { CanvasPosition } from "modules/core/foundation";
import CanvasStore from "../canvas/CanvasStore";
import { ProjectRegistry } from "./ProjectRegistry";

export default class ProjectStore {
  private _registry = new ProjectRegistry();

  private get registry() {
    return this._registry;
  }

  public addTextbox({ position }: { position: CanvasPosition }) {
    console.log("added");
    CanvasStore.shouldRender = true;
    this.registry.addNode({ position, type: "textbox", text: "Textbox" });
  }

  public get root() {
    return this.registry.root;
  }
}
