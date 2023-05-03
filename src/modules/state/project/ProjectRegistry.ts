import { CanvasPosition } from "modules/core/foundation";
import { copyJSON } from "modules/core/function-utils";
import { MergeboxNode, Node, NodeType, TextboxNode } from "./ProjectTypes";
import { generateId } from "modules/core/project-utils";
import { WebsocketProvider } from "y-websocket";
import { Doc, Map } from "yjs";

export interface ProjectRoot {
  textboxes: {
    [id: string]: TextboxNode;
  };
  mergeboxes: {
    [id: string]: MergeboxNode;
  };
}

const getEmptyProjectRoot = () => {
  return {
    textboxes: {},
    mergeboxes: {},
    imageboxes: {},
    texts: {},
    images: {},
    videos: {},
  };
};

const doc = new Doc();
const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "advaita-boards",
  // "wss://s8900.blr1.piesocket.com/v3/1?api_key=TLi7SBirMhpM6hE8BGFobgTwVxrONF8DVVXhYuEq&notify_self=1",
  // "advaita-boards",
  // "wss://ws-ap2.pusher.com:443/app/b6229e41fcc751d61ba8",
  // "boards",
  doc
);

export class ProjectRegistry {
  private id: string | null = null;
  private _shadowRoot: Map<Map<TextboxNode> | Map<MergeboxNode>> =
    doc.getMap("testing");
  private _origin: ProjectRoot | null = null;

  private get textboxes() {
    return this.root.get("textboxes") as Map<TextboxNode>;
  }

  private get mergeboxes() {
    return this.root.get("mergeboxes") as Map<MergeboxNode>;
  }

  public addNode(node: Node) {
    if (node.type === "textbox") this.textboxes.set(node.id, node);
    else if (node.type === "mergebox") this.mergeboxes.set(node.id, node);
    return node;
  }

  public get root() {
    return this._shadowRoot;
  }

  public get origin() {
    return this._origin;
  }

  public patchNodePosition(id: string, position: CanvasPosition) {
    const node = this.getNode(id) as TextboxNode | null;
    if (node && "position" in node) {
      this.textboxes.set(id, { ...node, position });
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

  removeNode(id: string) {
    this.textboxes.delete(id);
    this.mergeboxes.delete(id);
  }

  patchNode(id: string, node: Partial<Node>) {
    const original = this.getNode(id);
    if (!original) return;
    const newNode = Object.assign({}, original, node);
    if (original.type === "textbox")
      this.textboxes.set(id, newNode as TextboxNode);
    else if (original.type === "mergebox")
      this.mergeboxes.set(id, newNode as MergeboxNode);
    this.touch(id);
  }

  public getNode(id: string): Node | undefined {
    return this.textboxes?.get(id) || this.mergeboxes?.get(id);
  }

  public getOriginNode(id: string): Node | undefined {
    if (this.origin)
      return this.origin.textboxes[id] || this.origin.mergeboxes[id];
  }

  public fork() {
    this._origin = this.___fetchRoot();
  }

  public resetWithFork() {
    const project = this.origin;
    if (!project) return;
    const newTextboxes = new Map<TextboxNode>();
    const newMergeboxes = new Map<MergeboxNode>();
    Object.values(project.textboxes).map((node) =>
      newTextboxes.set(node.id, node)
    );
    Object.values(project.mergeboxes).map((node) =>
      newMergeboxes.set(node.id, node)
    );
    this.root.set("textboxes", newTextboxes);
    this.root.set("mergeboxes", newMergeboxes);
  }

  public commit() {
    this._origin = this.___fetchRoot();
  }

  public ___loadRegistry(id: string, root: ProjectRoot) {
    this.id = id;
    this._shadowRoot = doc.getMap<Map<TextboxNode> | Map<MergeboxNode>>(
      `board-${id}`
    );
    const textboxes = new Map<TextboxNode>();
    const mergeboxes = new Map<MergeboxNode>();
    this.root.set("textboxes", textboxes);
    this.root.set("mergeboxes", mergeboxes);
  }

  public ___fetchRoot(): ProjectRoot {
    return ["textboxes", "mergeboxes"].reduce(
      (result, field) => {
        this.root.get(field)?.forEach((value) => {
          result[field][value.id] = value;
        });
        return result;
      },
      { textboxes: {}, mergeboxes: {} }
    );
  }

  public get boardId() {
    return this.id;
  }

  get allTextboxes() {
    let boxes: TextboxNode[] = [];
    const it = this.textboxes?.values();
    if (!it) return [];
    let result = it.next();
    while (!result.done) {
      boxes.push(result.value);
      result = it.next();
    }
    return boxes;
  }
  get allMergeboxes() {
    let boxes: MergeboxNode[] = [];
    const it = this.mergeboxes?.values();
    if (!it) return [];
    let result = it.next();
    while (!result.done) {
      boxes.push(result.value);
      result = it.next();
    }
    return boxes;
  }
}
