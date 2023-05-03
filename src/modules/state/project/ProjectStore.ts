import { CanvasPosition } from "modules/core/foundation";
import { generateId, saveBoard } from "modules/core/project-utils";
import AppStore from "../AppStore";
import { ProjectRegistry, ProjectRoot } from "./ProjectRegistry";
import { Comment, Node, NodeType, RootNode } from "./ProjectTypes";
import { Board, User } from "modules/core/NetworkTypes";

export default class ProjectStore {
  public board: Board | null = null;
  private author: User | null = null;
  private _registry = new ProjectRegistry();

  public get registry() {
    return this._registry;
  }

  public getNode(id: string) {
    return this.registry.getNode(id);
  }

  public moveBox(id: string, position: Partial<CanvasPosition>) {
    const node = this.registry.getNode(id);
    if (!node || !("position" in node)) return;
    this.registry.patchNodePosition(id, { ...node.position, ...position });
    saveBoard();
    AppStore.canvas.shouldRender = true;
  }

  public addImagebox(
    id: string,
    { url, position }: { url: string; position: CanvasPosition }
  ) {
    if (this.registry.getNode(id)) {
      const node = this.registry.getNode(id) as ImageboxNode;
      this.registry.patchNodePosition(id, position);
      node.children.forEach((child) => {
        this.registry.patchNodePosition(child.id, {
          left: 0,
          top: 0,
          width: position.width,
          height: position.height,
        });
      });
    } else {
      const childId = generateId();
      const inner = this.registry.addNode({
        id: childId,
        position: {
          left: 0,
          top: 0,
          width: position.width,
          height: position.height,
        },
        type: "image",
        url,
        cacheKey: "",
      });
      this.registry.addNode({
        id,
        position,
        type: "imagebox",
        children: [{ id: inner.id, type: "image" }],
        cacheKey: "",
      });
    }
    AppStore.canvas.shouldRender = true;
  }

  public addMergeBox(
    id: string,
    {
      parent,
      child,
      position,
      comments,
      diff,
      connections,
    }: {
      parent: string;
      child: string;
      position: CanvasPosition;
      comments: Comment[];
      connections: { id: string }[];
      diff: string;
    }
  ) {
    this.registry.addNode({
      id,
      position,
      type: "mergebox",
      children: [],
      comments: comments || [],
      cacheKey: "",
      diff,
      connections,
      author: this.author?.uuid || "",
      child,
      parent,
    });
    saveBoard();
    AppStore.canvas.shouldRender = true;
  }

  public addTextbox(
    id: string,
    { position, text }: { position: CanvasPosition; text?: string }
  ) {
    if (this.registry.getNode(id)) {
      this.registry.patchNodePosition(id, position);
    } else {
      console.log("adding", {
        id,
        position,
        title: generateId(),
        type: "textbox",
        children: [],
        cacheKey: "",
        align: "center",
        vertical: "center",
        author: this.author?.uuid || "",
        text: text || "",
      });
      this.registry.addNode({
        id,
        position,
        title: generateId(),
        type: "textbox",
        children: [],
        cacheKey: "",
        align: "center",
        vertical: "center",
        author: this.author?.uuid || "",
        text: text || "",
      });
      saveBoard();
    }
    AppStore.canvas.shouldRender = true;
  }

  public addTextToBox(
    id: string,
    text: string,
    { at, editOnCreate }: { at?: number; editOnCreate?: boolean }
  ) {
    const sub = this.registry.addNode({
      id: generateId(),
      type: "text",
      cacheKey: "",
      parent: id,
      text,
      bold: false,
      italic: false,
      underline: false,
      size: 16,
      style: "none",
      author: this.author?.uuid || "",
      editOnCreate,
    }) as TextNode;
    this.registry.addNodeChild(
      id,
      sub,
      at !== undefined ? at : this.registry.getNode(id).children?.length || 0
    );
    AppStore.canvas.shouldRender = true;
  }

  public setNode(id: string, node: Partial<Node>) {
    this.registry.patchNode(id, node);
    AppStore.canvas.shouldRender = true;
    saveBoard();
  }

  public loadProject(nodes: Node[]) {
    nodes.map((node) => this.registry.addNode(node));
    AppStore.canvas.shouldRender = true;
  }

  public ___loadState(id: string, root: any) {
    return this.registry.___loadRegistry(id, root as ProjectRoot);
  }

  public ___fetchState() {
    return this.registry.___fetchRoot();
  }

  public addNodeChild(
    id: string,
    child: { id: string; type: NodeType },
    at?: number
  ) {
    this.registry.addNodeChild(id, child, at);
  }

  public removeChildNode(parent: string, id: string) {
    this.registry.removeChildNode(parent, id);
  }

  public removeNode(id: string) {
    this.registry.removeNode(id);
  }

  public setEditOnCreate(id: string, value: boolean) {
    this.registry.patchEditOnCreate(id, value);
  }

  public fork() {
    this.registry.fork();
  }

  public resetWithFork() {
    this.registry.resetWithFork();
  }

  public commit() {
    this.registry.commit();
  }

  public get origin() {
    return this.registry.origin;
  }

  public getOriginNode(id: string) {
    return this.registry.getOriginNode(id);
  }

  public get root() {
    return this.registry.root;
  }

  public clearRegistry() {
    this.registry.clearRegistry();
  }

  public get user() {
    return this.author as User;
  }

  public set user(u: User) {
    this.author = u;
  }

  public get boardId() {
    return this.registry.boardId;
  }

  public get rootNodes(): RootNode[] {
    return ([] as RootNode[])
      .concat(this.registry.textboxes)
      .concat(this.registry.mergeboxes);
  }
}
