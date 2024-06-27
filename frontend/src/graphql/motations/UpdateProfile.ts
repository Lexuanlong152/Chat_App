import { gql } from "@apollo/client"

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($fullname: String!, $avatarUrl: String!) {
    updateProfile(fullname: $fullname, avatarUrl: $avatarUrl) {
      id
      fullname
      avatarUrl
    }
  }
`