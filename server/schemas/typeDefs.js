const { gql } = require('apollo-server-express'); 

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [bookSchema]
}

type bookSchema {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

input savedBook {
    authors: [String]
    bookId: ID!
    description: String!
    image: String
    link: String
    title: String!
}

type Query {
    user: User!
    me: User!
    books: bookSchema!
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth 
    saveBook(authors: [String], bookId: ID!, description: String!, image: String, link: String, title: String!): User
    removeBook(bookId: ID!): User
}
`

module.exports = typeDefs; 