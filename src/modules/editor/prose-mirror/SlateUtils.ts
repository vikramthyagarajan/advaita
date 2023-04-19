import { MergeboxNode, TextboxNode } from "modules/state/project/ProjectTypes";
import AppStore from "modules/state/AppStore";
import { generateId } from "modules/core/project-utils";
import {
  addCommentQuery,
  fetchDocumentCommentsQuery,
} from "modules/core/network-utils";

export const onMergeDocument = async (id: string) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  const parent = AppStore.project.getNode(node.parent || "") as TextboxNode;
  if (!node || !parent) return;
  const { comments, diff } = await fetchDocumentCommentsQuery(node.id);
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
    diff,
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
