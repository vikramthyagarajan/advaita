import { CanvasPosition } from "modules/core/foundation";
import { copyJSON } from "modules/core/function-utils";
import {
  ImageboxNode,
  Node,
  NodeType,
  SubNode,
  SubNodeType,
  TextboxNode,
  TextNode,
} from "./ProjectTypes";

export interface ProjectRoot {
  textboxes: {
    [id: string]: TextboxNode;
  };
  imageboxes: {
    [id: string]: ImageboxNode;
  };
  texts: {
    [id: string]: TextNode;
  };
  images: {
    [id: string]: Node;
  };
  videos: {
    [id: string]: Node;
  };
}

export class ProjectRegistry {
  private _shadowRoot: ProjectRoot = {
    textboxes: {},
    imageboxes: {},
    texts: {},
    images: {},
    videos: {},
  };
  private _root: ProjectRoot = {
    textboxes: {},
    imageboxes: {},
    texts: {},
    images: {},
    videos: {},
  };

  public get root() {
    return this._shadowRoot;
  }

  public get origin() {
    return this._root;
  }

  public addNode(node: Node) {
    if (node.type === "textbox") this.root.textboxes[node.id] = node;
    else if (node.type === "text") this.root.texts[node.id] = node;
    else if (node.type === "imagebox") this.root.imageboxes[node.id] = node;
    else if (node.type === "image") this.root.images[node.id] = node;
    return node;
  }

  public patchNodePosition(id: string, position: CanvasPosition) {
    const node = this.getNode(id);
    if ("position" in node) {
      node.position = position;
      this.touch(id);
    }
  }

  private touch(id: string) {
    const node = this.getNode(id);
    const tNow = performance.now();
    node.cacheKey = `${tNow}-${node.id}`;
    if (node.parent) {
      this.touch(node.parent);
    }
  }

  public addNodeChild(
    id: string,
    child: { id: string; type: NodeType },
    at?: number
  ) {
    const node = this.getNode(id);
    const index = at === undefined ? node.children?.length || 0 : at;
    if (node.children) {
      node.children.splice(index, 0, { id: child.id, type: child.type });
    } else node.children = [{ id: child.id, type: child.type }];
  }

  patchNodeText(id: string, text: string) {
    const node = this.root.texts[id];
    if (node) node.text = text;
    this.touch(id);
  }

  removeChildNode(parent: string, id: string) {
    const node = this.getNode(parent);
    if (node.children) {
      const index = node.children.findIndex((child) => child.id === id);
      if (index === -1) return;
      node.children.splice(index, 1);
    }
    this.touch(parent);
  }

  removeNode(id: string) {
    delete this.root.textboxes[id];
    delete this.root.imageboxes[id];
  }

  patchNode(id: string, node: Partial<Node>) {
    const original = this.getNode(id);
    Object.assign(original, node);
    this.touch(id);
  }

  patchEditOnCreate(id: string, value: boolean) {
    const node = this.getNode(id) as TextNode | null;
    if (node) node.editOnCreate = value;
    this.touch(id);
  }

  public getNode(id: string): Node {
    return (
      this.root.textboxes[id] ||
      this.root.imageboxes[id] ||
      this.root.texts[id] ||
      this.root.images[id] ||
      this.root.videos[id]
    );
  }

  public getOriginNode(id: string): Node {
    return (
      this.origin.textboxes[id] ||
      this.origin.imageboxes[id] ||
      this.origin.texts[id] ||
      this.origin.images[id] ||
      this.origin.videos[id]
    );
  }

  public fork() {
    this._root = copyJSON(this._shadowRoot);
  }

  public resetWithFork() {
    this._shadowRoot = copyJSON(this._root);
  }

  public commit() {
    this._root = copyJSON(this._shadowRoot);
  }

  public ___loadRegistry(root: ProjectRoot) {
    this._shadowRoot = copyJSON(root);
    this._root = copyJSON(root);
  }

  public ___fetchRoot() {
    return copyJSON(this._shadowRoot);
  }

  get textboxes() {
    return Object.values(this.root.textboxes);
  }
  get imageboxes() {
    return Object.values(this.root.imageboxes);
  }
  get texts() {
    return Object.values(this.root.texts);
  }
  get images() {
    return Object.values(this.root.images);
  }
  get videos() {
    return Object.values(this.root.videos);
  }
}
