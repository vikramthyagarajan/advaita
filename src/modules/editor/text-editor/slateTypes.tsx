import { ReactEditor } from "slate-react";
import {
  BaseEditor,
  Element,
  Node,
  NodeEntry,
  Selection,
  BaseText,
  BaseElement,
  Path,
  Descendant,
} from "slate";

export type Nullable<T> = T | null;

export interface SlateGraspEditorBase extends ReactEditor {
  //with Base
  editorId: string;
  isSelectionExpanded: () => boolean;
  isSelectionCollapsed: () => boolean;
  isFocused: () => boolean;
  unwrapNode: (node: Node, options?) => void;
  isNodeTypeActive: (type: string) => boolean;
  rememberedSelection: Selection;
  rememberCurrentSelection: () => void;
  isCollapsed: () => boolean;
  wrapNode: (node: Node, wrapSelection: Nullable<Selection>) => boolean;
  syncExternalNodes: (
    type: string,
    nodesToKeep: Node[],
    unwrap: boolean
  ) => void;
  removeNotInList: (type: string, listOfIds: any[]) => void;
  unwrapNotInList: (type: string, listOfIds: any[]) => void;
  findNodesByType: (type: string) => Node[];
  serialize: (nodes: Node[]) => string;
  syncExternalNodesWithTemporaryId: (
    type: string,
    nodesToKeep: Node[],
    unwrap: boolean
  ) => void;
  getSelectedText: () => string;
  deleteCurrentNodeText: (anchorOffset?: number, focusOffset?) => string;
  getCurrentNodeText: (anchorOffset?: number, focusOffset?) => string;
  getCurrentNode();
  getCurrentNodePath(): Path;
  isCommandMenu: boolean;
  commands: any[];
  selectedCommand: number;
  //With Mark
  isMarkActive: (mark: string) => boolean;
  toggleMark: (mark: string) => CustomEditor;
  //With links
  isInline: (element: Element) => boolean;
  insertLink: (url: string) => void;
  insertConcept: (id: string) => void;
  insertData: (data: any) => void;
  //With Blocks
  isBlockActive: (block) => boolean;
  toggleBlock: (format: string) => CustomEditor;
  LIST_TYPES: string[];
  //With Blocks
}

export type CustomEditor = BaseEditor & ReactEditor & SlateGraspEditorBase;

export type BlockQuoteElement = { type: "block-quote"; children: Descendant[] };

export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

export type CheckListItemElement = {
  type: "check-list-item";
  checked: boolean;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: "editable-void";
  children: EmptyText[];
};

// export type HeadingElement = { type: 'heading'; children: CustomText[] }

// export type HeadingTwoElement = { type: 'heading-two'; children: CustomText[] }

export type HeadingTitleElement = {
  type: "heading-0";
  children: CustomText[];
};

export type HeadingOneElement = {
  type: "heading-1";
  children: CustomText[];
};
export type HeadingTwoElement = {
  type: "heading-2";
  children: CustomText[];
};
export type HeadingThreeElement = {
  type: "heading-3";
  children: CustomText[];
};

export type ImageElement = {
  type: "image";
  url: string;
  children: EmptyText[];
};

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type ListItemElement = { type: "list-item"; children: Descendant[] };

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

export type TableRow = unknown;
export type TableCell = unknown;

export type ParagraphElement = { type: "paragraph"; children: Descendant[] };

export type TableElement = { type: "table"; children: TableRow[] };

export type TableCellElement = { type: "table-cell"; children: CustomText[] };

export type TableRowElement = { type: "table-row"; children: TableCell[] };

export type TitleElement = { type: "title"; children: Descendant[] };

export type VideoElement = {
  type: "video";
  url: string;
  children: EmptyText[];
};

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingTitleElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | ImageElement
  | LinkElement
  | ListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement;

export type CustomText = {
  text: string;
  bold?: true;
  code?: true;
  italic?: true;
  strikethrough?: true;
  underlined?: true;
  underline?: true;
};

export type EmptyText = {
  text: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
  }
}

export const initialSlateValue = (): Descendant[] => {
  return [
    { type: "heading-0", children: [{ text: "Slate.js" }] },
    {
      type: "paragraph",
      children: [
        { text: "Slate is a ", bold: true },
        { text: "completely", italic: true, bold: true },
        {
          text: " customizable framework for building rich text editors.",
          bold: true,
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Slate lets you build rich, intuitive editors like those in Medium, Dropbox Paper or Google Docs—which are becoming table stakes for applications on the web—without your codebase getting mired in complexity.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "It can do this because all of its logic is implemented with a series of plugins, so you aren't ever constrained by what ",
        },
        { text: "is", italic: true },
        { text: " or " },
        { text: "isn't", italic: true },
        {
          text: ' in "core". You can think of it like a pluggable implementation of ',
        },
        { text: "contenteditable", code: true },
        {
          text: " built on top of React. It was inspired by libraries like Draft.js, Prosemirror and Quill.",
        },
      ],
    },
    {
      type: "block-quote",
      children: [
        { text: "🤖 " },
        { text: "Slate is currently in beta", bold: true },
        {
          text: '. Its core API is usable now, but you might need to pull request fixes for advanced use cases. Some of its APIs are not "finalized" and will (breaking) change over time as we find better solutions.',
        },
      ],
    },
    { type: "heading-1", children: [{ text: "Why Slate?" }] },
    {
      type: "paragraph",
      children: [
        { text: "Why create Slate? Well... " },
        {
          text: "(Beware: this section has a few ofmyopinions!)",
          italic: true,
        },
        {
          text: "Before creating Slate, I tried a lot of the other rich text libraries out there—",
        },
        { text: "Draft.js", bold: true },
        { text: ", " },
        { text: "Prosemirror", bold: true },
        { text: ", " },
        { text: "Quill", bold: true },
        {
          text: ", etc. What I found was that while getting simple examples to work was easy enough, once you started trying to build something like Medium, Dropbox Paper or Google Docs, you ran into deeper issues...",
        },
      ],
    },
    {
      type: "bulleted-list",
      children: [
        {
          type: "list-item",
          children: [
            {
              text: 'The editor\'s "schema" was hardcoded and hard to customize.',
              bold: true,
            },
            {
              text: " Things like bold and italic were supported out of the box, but what about comments, or embeds, or even more domain-specific needs?",
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              text: "Transforming the documents programmatically was very convoluted.",
              bold: true,
            },
            {
              text: " Writing as a user may have worked, but making programmatic changes, which is critical for building advanced behaviors, was needlessly complex.",
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              text: "Serializing to HTML, Markdown, etc. seemed like an afterthought.",
              bold: true,
            },
            {
              text: " Simple things like transforming a document to HTML or Markdown involved writing lots of boilerplate code, for what seemed like very common use cases.",
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              text: "Re-inventing the view layer seemed inefficient and limiting.",
              bold: true,
            },
            {
              text: ' Most editors rolled their own views, instead of using existing technologies like React, so you had to learn a whole new system with new "gotchas".',
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              text: "Collaborative editing wasn't designed for in advance.",
              bold: true,
            },
            {
              text: " Often the editor's internal representation of data made it impossible to use for a realtime, collaborative editing use case without basically rewriting the editor.",
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              text: "The repositories were monolithic, not small and reusable.",
              bold: true,
            },
            {
              text: " The code bases for many of the editors often didn't expose the internal tooling that could have been re-used by developers, leading to having to reinvent the wheel.",
            },
          ],
        },
        {
          type: "list-item",
          children: [
            {
              text: "Building complex, nested documents was impossible.",
              bold: true,
            },
            {
              text: ' Many editors were designed around simplistic "flat" documents, making things like tables, embeds and captions difficult to reason about and sometimes impossible.',
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Of course not every editor exhibits all of these issues, but if you've tried using another editor you might have run into similar problems. To get around the limitations of their APIs and achieve the user experience you're after, you have to resort to very hacky things. And some experiences are just plain impossible to achieve.",
        },
      ],
    },
    {
      type: "paragraph",
      children: [{ text: "If that sounds familiar, you might like Slate." }],
    },
    {
      type: "paragraph",
      children: [
        { text: "Which brings me to how Slate solves all of that..." },
      ],
    },
    { type: "heading-0", children: [{ text: "Edu-Eidtor" }] },
    {
      type: "paragraph",
      children: [
        {
          text: "Edu-Editor is a basic medium, notion like rich text editor based on Slate.js framework.",
        },
      ],
    },
    { type: "heading-1", children: [{ text: "Basic Features" }] },
    {
      type: "bulleted-list",
      children: [
        { type: "list-item", children: [{ text: "blocks" }] },
        { type: "list-item", children: [{ text: "command" }] },
        { type: "list-item", children: [{ text: "paragraph" }] },
        { type: "list-item", children: [{ text: "headings" }] },
        { type: "list-item", children: [{ text: "lists" }] },
        { type: "list-item", children: [{ text: "Slash commands" }] },
      ],
    },
    { type: "paragraph", children: [{ text: "" }] },
  ];
};
