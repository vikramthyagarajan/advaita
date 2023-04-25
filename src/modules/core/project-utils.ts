import { v4 } from "uuid";

export const generateId = () => {
  return v4();
};

export const getAuthorId = () => {
  if (!localStorage.getItem("author")) {
    const id = generateId();
    localStorage.setItem("author", id);
    return id;
  } else return localStorage.getItem("author");
};
