import { CanvasPosition } from "modules/core/foundation";
import { FocusEvent, KeyboardEvent, MouseEvent } from "react";

export type SubNodeType = "text" | "image" | "video" | "preview";
export type NodeType =
  | "textbox"
  | "imagebox"
  | "mergebox"
  | "videobox"
  | "graphics"
  | SubNodeType;

export interface GenericNode {
  type: NodeType;
  title?: string;
  id: string;
  cacheKey: string;
  parent?: string;
  connections?: { id: string }[];
  children?: { id: string; type: NodeType }[];
}

export type Align = "left" | "center" | "right";
export type VerticalAlign = "top" | "center";

interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  size: number;
}

export type TextStyles =
  | "none"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4";

export interface TextNode extends GenericNode, TextFormatting {
  type: "text";
  cacheKey: string;
  id: string;
  text: string;
  style: TextStyles;
  parent: string;
  editOnCreate?: boolean;
}

export interface TextboxNode extends GenericNode {
  type: "textbox";
  position: CanvasPosition;
  align: Align;
  vertical: VerticalAlign;
  text: string;
  selection?: [number, number];
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
  children: { type: NodeType; id: string }[];
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
  position: CanvasPosition;
  comments: Comment[];
}

export interface PreviewNode {
  type: "preview";
  id: string;
}

export type SubNode = TextNode | ImageNode;
export type Node = TextboxNode | ImageboxNode | SubNode | MergeboxNode;

export type AllEventTypes =
  | FocusEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>
  | MouseEvent<HTMLDivElement>;
