//@ts-nocheck
import { Descendant, Node, Point } from "slate";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import frontmatter from "remark-frontmatter";
import stringify from "remark-stringify";
import {
  remarkToSlate,
  slateToRemark,
  remarkToSlateLegacy,
  slateToRemarkLegacy,
} from "remark-slate-transformer";
import { jsx } from "slate-hyperscript";
import { MergeboxNode, TextboxNode } from "modules/state/project/ProjectTypes";
import AppStore from "modules/state/AppStore";
import { generateId } from "modules/core/project-utils";
import {
  addCommentQuery,
  fetchDocumentCommentsQuery,
} from "modules/core/network-utils";

const toSlateProcessor = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(remarkToSlate);

const toRemarkProcessor = unified()
  .use(slateToRemark)
  .use(gfm)
  .use(frontmatter)
  .use(stringify);

export const toSlate = <T>(s: string) =>
  toSlateProcessor.processSync(s).result as T[];
export const toMd = <T>(value: T[]): string => {
  const mdast = toRemarkProcessor.runSync({
    type: "root",
    //@ts-ignore
    children: value,
  });
  return toRemarkProcessor.stringify(mdast);
};

export const getUserSelectionDiff = (
  startRange: Point,
  endRange: Point,
  slate: Descendant[]
) => {
  const range = [startRange.path[0], endRange.path[0]];
  const preNodes = slate.slice(0, range[0]);
  const nodes: Descendant[] = slate.slice(range[0], range[1] + 1);
  const postNodes = slate.slice(range[1] + 1);
  const diff = toMd(nodes);
  return {
    diff,
    original: `${toMd(preNodes)}<!---->${toMd(postNodes)}`,
  };
};

export const toJsx = (slate: Descendant[]) => jsx("fragment", {}, children);

export const onMergeDocument = async (id: string) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  const parent = AppStore.project.getNode(node.parent) as TextboxNode;
  if (!node || !parent) return;
  const comments = await fetchDocumentCommentsQuery(node.id);
  const mergeId = generateId();
  const position = {
    width: parent.position.width * 2,
    height: parent.position.height * 1.5,
    top: parent.position.top - parent.position.height * 2,
    left: parent.position.left - parent.position.width,
  };
  AppStore.project.addMergeBox(mergeId, {
    child: node.id,
    parent: parent.id,
    position,
    comments: comments.map((c) => ({
      id: c.uuid,
      text: c.body,
      author: c.author,
      createdAt: c.createdAt,
    })),
  });
};

export const onCommentAdd = ({
  mergeboxId,
  text,
  author,
}: {
  mergeboxId: string;
  text: string;
  author: string;
  parentId?: string;
}) => {
  const node = AppStore.project.getNode(mergeboxId) as MergeboxNode;
  const id = generateId();
  const createdAt = Date.now();
  AppStore.project.setNode(mergeboxId, {
    comments: [...node.comments, { id, text, author, createdAt, comments: [] }],
  });
  addCommentQuery(node.child, { text, author, createdAt, id });
};
