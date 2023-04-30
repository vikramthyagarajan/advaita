import { v4 } from "uuid";
import { faker } from "@faker-js/faker";
import { saveBoardQuery } from "./network-utils";
import AppStore from "modules/state/AppStore";
import { User } from "./NetworkTypes";

export const generateId = () => {
  return v4();
};

export const generateProjectName = () => {
  return faker.company.bs();
};

export const generateName = () => {
  return faker.name.fullName();
};

export const getAuthorId = () => {
  const user = getUser();
  return user?.uuid;
};

export const getUser = () => {
  const stringified = localStorage.getItem("user");
  if (stringified) return JSON.parse(stringified) as User;
  return null;
};

export const saveBoard = () => {
  const root = AppStore.project.___fetchState();
  const id = AppStore.project.boardId;
  if (id) saveBoardQuery(id, root);
};
