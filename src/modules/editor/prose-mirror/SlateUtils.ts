import { MergeboxNode, TextboxNode } from "modules/state/project/ProjectTypes";
import AppStore from "modules/state/AppStore";
import { generateId } from "modules/core/project-utils";
import {
  addCommentQuery,
  fetchDocumentCommentsQuery,
} from "modules/core/network-utils";
import { EditorState } from "prosemirror-state";
import { Fragment, Slice } from "prosemirror-model";
import { defaultMarkdownSerializer, schema } from "prosemirror-markdown";

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

export const getUserSelectionDiff = (editorState: EditorState) => {
  const selection = editorState.selection;
  const doc = editorState.doc;

  const startOfFirstNode = selection.$from.posAtIndex(0);
  const endOfLastNode = selection.$to.posAtIndex(1);
  const lastCharacter = doc.content.size - (doc.lastChild?.nodeSize || 0);

  const commentSlice = new Slice(Fragment.from(schema.text("<!---->")), 0, 0);
  console.log("awesomesauce", doc.copy(doc.content));
  const originalDoc = doc
    .copy(doc.content)
    .replace(startOfFirstNode, endOfLastNode, commentSlice);
  const diffDoc = doc.cut(startOfFirstNode, endOfLastNode);

  const diff = defaultMarkdownSerializer.serialize(diffDoc);
  const original = defaultMarkdownSerializer.serialize(originalDoc);

  return { original, diff, selection: [startOfFirstNode, endOfLastNode] };
};

// export const getUserSelectionDiff = () => {
//   export const getUserSelectionDiff = (
//     startRange: Point,
//     endRange: Point,
//     slate: Descendant[]
//   ) => {
//     const range = [startRange.path[0], endRange.path[0]];
//     const preNodes = slate.slice(0, range[0]);
//     const nodes: Descendant[] = slate.slice(range[0], range[1] + 1);
//     const postNodes = slate.slice(range[1] + 1);
//     const diff = toMd(nodes);
//     return {
//       diff,
//       original: `${toMd(preNodes)}<!---->${toMd(postNodes)}`,
//     };
//   };

// }
