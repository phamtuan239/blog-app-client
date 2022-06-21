import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation ($input: registerInput) {
    register(input: $input)
  }
`;

export const LOGIN = gql`
  mutation ($input: loginInput) {
    login(input: $input)
  }
`;

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export const ACTIVE_ACCOUNT = gql`
  mutation ($input: String) {
    activeAccount(input: $input)
  }
`;

export const UPLOAD_PROFILE_PIC = gql`
  mutation ($input: uploadProfilePicInput) {
    uploadProfilePic(input: $input) {
      public_id
      url
    }
  }
`;

export const UPDATE_INFO = gql`
  mutation ($input: updateInfoInput) {
    updateInfo(input: $input) {
      email
      username
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation ($input: updatePasswordInput) {
    updatePassword(input: $input)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ($input: String) {
    forgotPassword(input: $input)
  }
`;

export const CONTACT = gql`
  mutation ($input: contactInput) {
    contact(input: $input)
  }
`;
