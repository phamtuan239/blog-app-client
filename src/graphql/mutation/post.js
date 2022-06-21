import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation ($input: createPostInput) {
    createPost(input: $input)
  }
`;

export const UPDATE_POST = gql`
  mutation ($input: updatePostInput) {
    updatePost(input: $input)
  }
`;

export const DELETE_POST = gql`
  mutation ($input: ID!) {
    deletePost(input: $input)
  }
`;

export const DELETE_POSTS = gql`
  mutation ($input: [ID]!) {
    deletePosts(input: $input)
  }
`;
