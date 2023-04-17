import axios from "axios";
import {
  GenericNode,
  MergeboxNode,
  TextboxNode,
} from "modules/state/project/ProjectTypes";
import { generateId, getAuthorId } from "./project-utils";
import AppStore from "modules/state/AppStore";
import Pusher from "pusher-js";

const backendUrl = "http://192.168.29.215:3000";

export const fetchAllDocumentsQuery = () => {
  return axios
    .get(`${backendUrl}/documents.json`)
    .then((response) => {
      const data = response.data;
      return data.map((document) => {
        return document.metadata.node;
      });
    })
    .catch((e) => {
      console.error("error during doc fetch", e);
    });
};

export const createNewDocumentQuery = async (
  title: string,
  author: string,
  node: TextboxNode
) => {
  return axios.post(
    `${backendUrl}/documents.json`,
    {
      document: {
        title,
        body: node.text,
        uuid: node.id,
        data: {
          node,
        },
      },
    },
    {
      headers: {
        Author: author,
      },
    }
  );
};

export const saveDocumentQuery = async (id: string, node: TextboxNode) => {
  const response = await axios.patch(`${backendUrl}/documents/${id}.json`, {
    body: node.text,
    data: {
      node,
    },
  });
  return;
};

export const forkDocumentQuery = async ({
  id,
  original,
  diff,
  author,
  forkedNode,
}: {
  id: string;
  original: string;
  diff: string;
  author: string;
  forkedNode: TextboxNode;
}) => {
  const node = AppStore.project.getNode(id) as TextboxNode;
  const response = await axios.post(
    `${backendUrl}/documents/${id}/fork.json`,
    {
      document: {
        title: node.title || "",
        body: forkedNode.text,
        uuid: forkedNode.id,
        data: {
          node: forkedNode,
        },
      },
    },
    {
      headers: {
        Author: author,
      },
    }
  );
  console.log("got response after fork", response);
  return response;
};

export const fetchDocumentCommentsQuery = async (id: string) => {
  const comments = await axios.get(
    `${backendUrl}/documents/${id}/comments.json`
  );
  return JSON.parse(JSON.stringify(comments.data));
};

export const addCommentQuery = async (
  documentId: string,
  {
    text,
    author,
    createdAt,
    id,
  }: { text: string; author: string; createdAt: number; id: string }
) => {
  return await axios.post(
    `${backendUrl}/documents/${documentId}/comments.json`,
    {
      comment: {
        uuid: id,
        body: text,
        createdAt,
        author,
      },
    },
    {
      headers: {
        Author: author,
      },
    }
  );
};

export const acceptMergeDocumentQuery = async (id: string) => {
  const data = (await axios.post(`${backendUrl}/documents/${id}/merge.json`))
    .data;
  return JSON.parse(JSON.stringify(data));
};

export const initializeSockets = async () => {
  Pusher.logToConsole = true;
  const socketClient = new Pusher("b6229e41fcc751d61ba8", {
    cluster: "ap2",
  });

  const channel = socketClient.subscribe("boards");
  channel.bind("update-board", function (data) {
    console.log("update board request", data);
  });

  channel.bind("create-document", (data) => {
    const document = data;
    console.log("got document to create", document);
    const node = AppStore.project.getNode(document.uuid);
    if (!node)
      AppStore.project.registry.addNode({
        ...document.data.node,
      });
  });

  channel.bind("update-document", (data) => {
    const document = data;
    console.log("got document to update", document);
    const node = AppStore.project.getNode(document.uuid) as TextboxNode;
    if (
      document.data.node.author === getAuthorId ||
      (node && document.data.node.text === node.text)
    )
      return;
    AppStore.project.removeNode(document.uuid);
    setTimeout(() => {
      AppStore.project.registry.addNode({
        ...document.data.node,
      });
    }, 500);
  });

  channel.bind("create-comment", async (data) => {
    const comment = data;
    const documentId = comment.document_uuid;
    const node = AppStore.project.registry.mergeboxes.find(
      (m) => m.child === documentId
    ) as MergeboxNode | null;
    if (!node) {
      const child = AppStore.project.getNode(documentId) as TextboxNode;
      const parent = AppStore.project.getNode(
        child.parent || ""
      ) as TextboxNode;
      if (!node || !parent || !child) return;
      const { comments, diff } = await fetchDocumentCommentsQuery(child.id);
      const mergeId = generateId();
      const position = {
        width: parent.position.width * 2,
        height: parent.position.height * 1.5,
        top: parent.position.top - parent.position.height * 2,
        left: parent.position.left - parent.position.width,
      };
      AppStore.project.addMergeBox(mergeId, {
        child: child.id,
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
    } else {
      const { comments, diff } = await fetchDocumentCommentsQuery(node.child);
      AppStore.project.setNode(node.id, {
        comments: comments.map((c) => ({
          id: c.uuid,
          text: c.body,
          author: c.author,
          createdAt: c.createdAt,
        })),
      });
    }
  });

  // const poller = async () => {
  //   const documents = await fetchAllDocumentsQuery();

  //   AppStore.project.loadProject(documents);
  // };
  // const interval = setInterval(poller, 2000);
  // window.onbeforeunload = () => {
  //   clearInterval(interval);
  // };
};
