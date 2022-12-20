import { CanvasPosition } from "modules/core/foundation";
import { FocusEvent, KeyboardEvent, MouseEvent } from "react";

export type SubNodeType = "text" | "image" | "video" | "preview";
export type NodeType =
  | "textbox"
  | "imagebox"
  | "videobox"
  | "graphics"
  | SubNodeType;

export interface GenericNode {
  type: NodeType;
  id: string;
  cacheKey: string;
  parent?: string;
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

export interface PreviewNode {
  type: "preview";
  id: string;
}

export type SubNode = TextNode | ImageNode;
export type Node = TextboxNode | ImageboxNode | SubNode;

export type AllEventTypes =
  | FocusEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>
  | MouseEvent<HTMLDivElement>;
