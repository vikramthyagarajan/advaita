import { CanvasPosition } from "modules/core/foundation";

type NodeType = "textbox" | "image" | "video" | "graphics";

export interface Node {
  type: NodeType;
  position: CanvasPosition;
  text: string;
}

interface ProjectRoot {
  nodes: Node[];
}

export class ProjectRegistry {
  private _root: ProjectRoot = {
    nodes: [],
  };

  public get root() {
    return this._root;
  }

  public addNode(node: Node) {
    this._root.nodes.push(node);
  }
}
