import axios from "axios";
import { GenericNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { getAuthorId } from "./project-utils";
import AppStore from "modules/state/AppStore";
import Pusher from "pusher-js";

const backendUrl = "http://192.168.29.215:3000";

export const fetchAllDocumentsQuery = () => {
  return Promise.resolve([]);
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
  return Promise.resolve();
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
  return Promise.resolve();
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
  return Promise.resolve();
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

export const initializeSockets = async () => {
  return Promise.resolve();
  Pusher.logToConsole = true;
  const socketClient = new Pusher("b6229e41fcc751d61ba8", {
    cluster: "ap2",
  });

  const channel = socketClient.subscribe("boards");
  channel.bind("update-board", function (data) {
    console.log("update board request", data);
  });
};
