import { CanvasPosition } from "modules/core/foundation";
import { FocusEvent, KeyboardEvent, MouseEvent } from "react";

export type NodeType = "textbox" | "mergebox";

export interface GenericNode {
  type: NodeType;
  title?: string;
  id: string;
  cacheKey: string;
  parent?: string;
  author: string;
  connections?: { id: string }[];
  children?: { id: string; type: NodeType }[];
}

export type Align = "left" | "center" | "right";
export type VerticalAlign = "top" | "center";

export type TextStyles =
  | "none"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4";

export interface TextboxNode extends GenericNode {
  type: "textbox";
  position: CanvasPosition;
  align: Align;
  vertical: VerticalAlign;
  text: string;
  selection?: [number, number];
  preText?: string;
  postText?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: number;
  comments?: Comment[];
}

export interface MergeboxNode extends GenericNode {
  type: "mergebox";
  child: string;
  parent: string;
  diff: string;
  position: CanvasPosition;
  comments: Comment[];
}

export interface PreviewNode {
  type: "preview";
  id: string;
}

export type RootNode = TextboxNode | MergeboxNode;
export type Node = RootNode;

export type AllEventTypes =
  | FocusEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>
  | MouseEvent<HTMLDivElement>;
