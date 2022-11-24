import { CanvasPosition } from "modules/core/foundation";

type NodeType = "textbox" | "image" | "video" | "graphics";

export interface Node {
  id: string;
  type: NodeType;
  position: CanvasPosition;
  text: string;
}

interface ProjectRoot {
  textboxes: {
    [id: string]: Node;
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
    images: {},
    videos: {},
  };

  public get root() {
    return this._root;
  }

  public addNode(node: Node) {
    if (node.type === "textbox") this.root.textboxes[node.id] = node;
  }

  public patchNodePosition(id: string, position: CanvasPosition) {
    const node = this.getNode(id);
    node.position = position;
  }

  patchNodeText(id: string, text: string) {
    this.getNode(id).text = text;
  }

  public getNode(id: string) {
    return (
      this.root.textboxes[id] || this.root.images[id] || this.root.videos[id]
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
