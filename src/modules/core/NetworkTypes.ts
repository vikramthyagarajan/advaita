import { ProjectRoot } from "modules/state/project/ProjectRegistry";

export type Board = {
  uuid: string;
  name: string;
  data: ProjectRoot;
};

export type User = {
  uuid: string;
  name: string;
  email: string;
  avatar: string;
};

export type Document = {
  uuid: string;
  title: string;
  body: string;
};

export type Comment = {
  uuid: string;
  body: string;
};

export type DocumentWithComments = {
  comments: Comment[];
} & Document;

export type PRQuery = {
  document: Document;
  children: DocumentWithComments[];
};
