import axios from "axios";
import { GenericNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { getAuthorId } from "./project-utils";

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
  const response = await axios.post(
    `${backendUrl}/documents/${id}/fork.json`,
    {
      document: {
        title: forkedNode.title || "",
        original,
        diff,
        forkedNode,
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
