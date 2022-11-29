import { CanvasPosition } from "modules/core/foundation";

type SubNodeType = "text" | "image" | "video";
type NodeType = "textbox" | "image" | "video" | "graphics" | SubNodeType;

export interface ImageSubNode {
  type: "image";
  id: string;
  image: string;
}

export interface TextSubNode {
  type: "text";
  id: string;
  text: string;
}

export type SubNode = TextSubNode | ImageSubNode;

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
}

export interface TextboxNode extends GenericNode {
  type: "textbox";
  position: CanvasPosition;
  align: Align;
  vertical: VerticalAlign;
  children: { type: SubNodeType; id: string }[];
}

export type Node = TextboxNode | TextNode;

interface ProjectRoot {
  textboxes: {
    [id: string]: TextboxNode;
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

  public addNodeChild(id: string, child: SubNode) {
    const node = this.getNode(id);
    if (node.children) {
      node.children.push({ id: child.id, type: child.type });
    } else node.children = [{ id: child.id, type: child.type }];
  }

  patchNodeText(id: string, text: string) {
    const node = this.root.texts[id];
    if (node) node.text = text;
    this.touch(id);
  }

  public getNode(id: string): Node {
    return (
      this.root.textboxes[id] ||
      this.root.texts[id] ||
      this.root.images[id] ||
      this.root.videos[id]
    );
  }

  get textboxes() {
    return Object.values(this.root.textboxes);
  }
  get images() {
    return Object.values(this.root.images);
  }
  get videos() {
    return Object.values(this.root.videos);
  }
}
