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

  public removeNode(id: string) {
    this.registry.removeNode(id);
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

  public getOriginNode(id: string) {
    return this.registry.getOriginNode(id);
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
      .concat(this.registry.allTextboxes)
      .concat(this.registry.allMergeboxes);
  }
}
