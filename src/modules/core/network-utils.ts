import axios from "axios";
import {
  GenericNode,
  MergeboxNode,
  TextboxNode,
} from "modules/state/project/ProjectTypes";
import {
  generateId,
  generateName,
  generateProjectName,
  getAuthorId,
} from "./project-utils";
import AppStore from "modules/state/AppStore";
import Pusher from "pusher-js";
import { faker } from "@faker-js/faker";

// const backendUrl = "https://api.advaita.co";
const backendUrl = "http://localhost:4000";
const cloudinaryCloudName = "diglgjher";
const cloudinaryPresetName = "thumbnails";
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`;

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
  const newText =
    (node.preText ? node.preText + "\n" : "") +
    node.text +
    "\n" +
    (node.postText ? "\n" + node.postText : "");
  const response = await axios.patch(`${backendUrl}/documents/${id}.json`, {
    body: newText,
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
    // const document = data;
    // console.log("got document to update", document);
    // const node = AppStore.project.getNode(document.uuid) as TextboxNode;
    // if (
    //   document.data.node.author === getAuthorId ||
    //   (node && document.data.node.text === node.text)
    // )
    //   return;
    // AppStore.project.removeNode(document.uuid);
    // setTimeout(() => {
    //   AppStore.project.registry.addNode({
    //     ...document.data.node,
    //   });
    // }, 500);
  });

  channel.bind("update-board", async (board) => {
    const id = board.uuid;
    const root = board.data;
    AppStore.project.___loadState(id, root);
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
        connections: [],
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

export const registerUserQuery = async ({
  id,
  name,
  email,
  avatar,
  password,
}: {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
}) => {
  return await axios.post(
    backendUrl + "/users.json",
    {
      user: {
        uuid: id,
        name,
        email,
        avatar,
        password,
        password_confirmation: password,
      },
    },
    { withCredentials: true }
  );
};

export const loginUserQuery = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await axios.post(
    backendUrl + "/users/sign_in.json",
    {
      user: {
        email,
        password,
      },
    },
    { withCredentials: true }
  );
};

export const uploadToCloudinary = async (id: string, image: string) => {
  return await axios.post(cloudinaryUrl, {
    file: image,
    upload_preset: cloudinaryPresetName,
    public_id: id,
  });
};

export const createBoardQuery = async (id: string, name: string, root: any) => {
  return await axios.post(
    backendUrl + "/boards.json",
    {
      board: {
        name,
        uuid: id,
        data: root,
      },
    },
    {
      withCredentials: true,
    }
  );
};

export const saveBoardQuery = async (id: string, root: any) => {
  // return await axios.put(
  //   backendUrl + `/boards/${id}.json`,
  //   {
  //     board: {
  //       data: root,
  //     },
  //   },
  //   {
  //     withCredentials: true,
  //   }
  // );
};

export const fetchAllBoardsQuery = async () => {
  return await axios.get(backendUrl + "/boards.json", {
    withCredentials: true,
  });
};

export const getBoardQuery = async (id: string) => {
  return await axios.get(backendUrl + `/boards/${id}.json`, {
    withCredentials: true,
  });
};

export const getDocumentVersionsQuery = async (id: string) => {
  // return await axios.get(backendUrl + `/documents/${id}/versions.json`);
  return [1, 2, 3, 4, 5].map(() => {
    return `## ${generateProjectName()} \n${faker.lorem.paragraph()}
    `;
  });
};
