import { gql } from "@apollo/client";

export const CREATED_POST = gql`
  subscription {
    createdPost {
      _id
      title
      backgroundPic
      createdAt
      categories {
        _id
        name
      }
      createdBy {
        _id
        username
        profilePic
      }
    }
  }
`;
