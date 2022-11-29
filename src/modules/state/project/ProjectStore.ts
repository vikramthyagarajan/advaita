import { CanvasPosition } from "modules/core/foundation";
import { generateId } from "modules/core/project-utils";
import AppStore from "../AppStore";
import { Node, ProjectRegistry, TextNode } from "./ProjectRegistry";

export default class ProjectStore {
  private _registry = new ProjectRegistry();

  private get registry() {
    return this._registry;
  }

  public getNode(id: string) {
    return this.registry.getNode(id);
  }

  public moveBox(id: string, position: Partial<CanvasPosition>) {
    const node = this.registry.getNode(id);
    if (!node || !("position" in node)) return;
    this.registry.patchNodePosition(id, { ...node.position, ...position });
    AppStore.canvas.shouldRender = true;
  }

  public addTextbox(id: string, { position }: { position: CanvasPosition }) {
    if (this.registry.getNode(id)) {
      this.registry.patchNodePosition(id, position);
    } else {
      this.registry.addNode({
        id,
        position,
        type: "textbox",
        children: [],
        cacheKey: "",
        align: "center",
        vertical: "center",
      });
    }
    AppStore.canvas.shouldRender = true;
  }

  public addTextToBox(id: string, text: string) {
    const sub = this.registry.addNode({
      id: generateId(),
      type: "text",
      cacheKey: "",
      parent: id,
      text,
    }) as TextNode;
    this.registry.addNodeChild(id, sub);
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
