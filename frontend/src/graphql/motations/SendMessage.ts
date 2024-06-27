import { gql } from "@apollo/client"

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatroomId: Float!, $content: String!, $imageUrl: String !) {
    sendMessage(chatroomId: $chatroomId, content: $content, imageUrl: $imageUrl) {
      id
      content
      imageUrl
      user {
        id
        fullname
        email
      }
    }
  }
`