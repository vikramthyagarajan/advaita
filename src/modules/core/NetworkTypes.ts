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
