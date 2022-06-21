import { atom } from "recoil";

export const postsState = new atom({
  key: "Posts",
  default: [],
});

export const myPostState = new atom({
  key: "My Post",
  default: [],
});

export const searchState = new atom({
  key: "Search",
  default: [],
});
