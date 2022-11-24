import { CanvasPosition } from "modules/core/foundation";
import { generateId } from "modules/core/project-utils";
import AppStore from "../AppStore";
import CanvasStore from "../canvas/CanvasStore";
import { Node, ProjectRegistry } from "./ProjectRegistry";

export default class ProjectStore {
  private _registry = new ProjectRegistry();

  private get registry() {
    return this._registry;
  }

  public addTextbox(id: string, { position }: { position: CanvasPosition }) {
    if (this.registry.getNode(id)) {
      this.registry.patchNodePosition(id, position);
    } else {
      console.log("added");
      this.registry.addNode({ id, position, type: "textbox", text: "" });
    }
    AppStore.canvas.shouldRender = true;
  }

  public editTextbox(id: string, { text }: { text: string }) {
    this.registry.patchNodeText(id, text);
    AppStore.canvas.shouldRender = true;
  }

  public get root() {
    return this.registry.root;
  }

  public get rootNodes(): Node[] {
    return ([] as Node[])
      .concat(this.registry.textboxes)
      .concat(this.registry.images)
      .concat(this.registry.videos);
  }
}
