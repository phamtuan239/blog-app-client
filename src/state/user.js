import { atom } from "recoil";

export const userState = new atom({
  key: "User",
  default: null,
});

export const editorState = new atom({
  key: "EditorUser",
  default: null,
});

export const optionState = new atom({
  key: "Option",
  default: "users",
});
