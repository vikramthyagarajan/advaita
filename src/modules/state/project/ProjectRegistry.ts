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
  images: {
    [id: string]: Node;
  };
  videos: {
    [id: string]: Node;
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
const map = doc.getMap<Map<TextboxNode> | Map<MergeboxNode>>("board1");
const textboxes = new Map<TextboxNode>();
const mergeboxes = new Map<MergeboxNode>();
map.set("textboxes", textboxes);
map.set("mergeboxes", mergeboxes);

export class ProjectRegistry {
  private id: string | null = null;
  private _shadowRoot: ProjectRoot = getEmptyProjectRoot();
  private _root: ProjectRoot = getEmptyProjectRoot();

  public get root() {
    return this._shadowRoot;
  }

  public get origin() {
    return this._root;
  }

  public addNode(node: Node) {
    if (node.type === "textbox") textboxes.set(node.id, node);
    else if (node.type === "mergebox") this.root.mergeboxes[node.id] = node;
    return node;
  }

  public patchNodePosition(id: string, position: CanvasPosition) {
    const node = this.getNode(id) as TextboxNode | null;
    if (node && "position" in node) {
      textboxes.set(id, { ...node, position });
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
    delete this.root.mergeboxes[id];
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
    return map.get("textboxes")?.get(id) || this.root.mergeboxes[id];
  }

  public getOriginNode(id: string): Node {
    return this.origin.textboxes[id] || this.origin.mergeboxes[id];
  }

  public fork() {
    this._root = copyJSON(this._shadowRoot);
  }

  public resetWithFork() {
    this._shadowRoot = copyJSON(this._root);
  }

  public commit() {
    // this._root = copyJSON(this._shadowRoot);
  }

  public clearRegistry() {
    this._shadowRoot = getEmptyProjectRoot();
    this._root = getEmptyProjectRoot();
  }

  public ___loadRegistry(id: string, root: ProjectRoot) {
    this.id = id;
    this._shadowRoot = copyJSON(root);
    this._root = copyJSON(root);
  }

  public ___fetchRoot() {
    return copyJSON({ ...this._shadowRoot });
  }

  public get boardId() {
    return this.id;
  }

  get textboxes() {
    let boxes: TextboxNode[] = [];
    const it = map.get("textboxes")?.values();
    if (!it) return [];
    let result = it.next();
    while (!result.done) {
      boxes.push(result.value);
      result = it.next();
    }
    return boxes;
    // return Object.values(this.root.textboxes || {});
  }
  get mergeboxes() {
    return Object.values(this.root.mergeboxes || {});
  }
}
