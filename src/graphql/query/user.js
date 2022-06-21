import { gql } from "@apollo/client";

export const GET_USER = gql`
  query {
    user {
      _id
      email
      username
      profilePic
      authType
      role
    }
  }
`;
