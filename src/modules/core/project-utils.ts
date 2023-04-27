import { v4 } from "uuid";
import { faker } from "@faker-js/faker";

export const generateId = () => {
  return v4();
};

export const generateName = () => {
  return faker.company.bs();
};

export const getAuthorId = () => {
  if (!localStorage.getItem("author")) {
    const id = generateId();
    localStorage.setItem("author", id);
    return id;
  } else return localStorage.getItem("author");
};
