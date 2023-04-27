import { v4 } from "uuid";
import { faker } from "@faker-js/faker";

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
  if (!localStorage.getItem("author")) {
    const id = generateId();
    localStorage.setItem("author", id);
    return id;
  } else return localStorage.getItem("author");
};
