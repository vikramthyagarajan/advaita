import axios from "axios";
import { GenericNode, TextboxNode } from "modules/state/project/ProjectTypes";
import { getAuthorId } from "./project-utils";

const backendUrl = "https://7349-49-36-191-234.ngrok-free.app";

export const fetchAllDocumentsQuery = () => {
  return axios
    .get<any, { metadata: TextboxNode }[]>(`${backendUrl}/documents.json`, {
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
        Author: getAuthorId(),
      },
    })
    .then((response) => {
      return response.map((document) => {
        return document.metadata;
      });
    });

  // return fetch(`${backendUrl}/documents.json`)
  //   .then((res) => res.json())
  //   .then((response) => {
  //     return response.map((document) => {
  //       return document.metadata;
  //     });
  //   });
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
        metadata: {
          node,
        },
      },
    },
    {
      headers: {
        Author: author,
      },
      withCredentials: false,
    }
  );
};
