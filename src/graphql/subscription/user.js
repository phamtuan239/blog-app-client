import { gql } from "@apollo/client";

export const UPLOADED_PROFILEPIC = gql`
  subscription {
    uplodedProfilePic {
      user_id
      image
    }
  }
`;

export const REGISTED = gql`
  subscription {
    registed {
      _id
      email
      username
      role
      passportId
      isActive
      profilePic
    }
  }
`;
