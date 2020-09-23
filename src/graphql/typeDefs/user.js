import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    authUserProfile: User!
    authenticateUser(username: String!, password: String!): AuthUser!
  }
  extend type Mutation {
    registerUser(newUser: UserInput!): AuthUser!
  }

  input UserInput {
    avatarImage: String
    email: String!
    firstName: String!
    lastName: String!
    username: String!
    password: String!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String!
    lastName: String!
    avatarImage: String
    createdAt: String
    updatedAt: String
  }

  type AuthUser {
    user: User!
    token: String!
  }
`;
