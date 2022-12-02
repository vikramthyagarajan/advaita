import { CanvasPosition } from "modules/core/foundation";

type SubNodeType = "text" | "image" | "video";
type NodeType = "textbox" | "imagebox" | "videobox" | "graphics" | SubNodeType;

export interface GenericNode {
  type: NodeType;
  id: string;
  cacheKey: string;
  parent?: string;
  children?: { id: string; type: NodeType }[];
}

export type Align = "left" | "center" | "right";
export type VerticalAlign = "top" | "center";

export interface TextNode extends GenericNode {
  type: "text";
  cacheKey: string;
  id: string;
  text: string;
  parent: string;
  editOnCreate?: boolean;
}

export interface TextboxNode extends GenericNode {
  type: "textbox";
  position: CanvasPosition;
  align: Align;
  vertical: VerticalAlign;
  children: { type: SubNodeType; id: string }[];
}

export interface ImageNode extends GenericNode {
  type: "image";
  url: string;
  position: CanvasPosition;
}

export interface ImageboxNode extends GenericNode {
  type: "imagebox";
  position: CanvasPosition;
  children: { type: SubNodeType; id: string }[];
}

export type SubNode = TextNode | ImageNode;
export type Node = TextboxNode | ImageboxNode | SubNode;

interface ProjectRoot {
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
  private _root: ProjectRoot = {
    textboxes: {},
    imageboxes: {},
    texts: {},
    images: {},
    videos: {},
  };

  public get root() {
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

  public addNodeChild(id: string, child: SubNode, at: number) {
    const node = this.getNode(id);
    if (node.children) {
      node.children.splice(at, 0, { id: child.id, type: child.type });
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
