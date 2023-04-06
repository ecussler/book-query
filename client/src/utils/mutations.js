import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          authors
          bookId
          image
          link
          title
          description
        }
      }
      token
    }
  }
`;

export const SAVE_BOOK = gql`
mutation Mutation($bookId: ID!, $description: String!, $title: String!, $authors: [String], $image: String, $link: String) {
  saveBook(bookId: $bookId, description: $description, title: $title, authors: $authors, image: $image, link: $link) {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;

export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    username
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`