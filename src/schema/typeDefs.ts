// schema/typeDefs.ts
import { gql } from "apollo-server-express";

const typeDefs = gql`
  # ------------------------------
  # User type and related inputs
  # ------------------------------
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    message: String!
    token: String!
    user: User!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  # ------------------------------
  # Todo type and related inputs
  # ------------------------------
  enum TodoStatus {
    PENDING
    IN_PROGRESS
    DONE
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    status: TodoStatus!
    dueDate: String
    userId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type TodoList {
    items: [Todo!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  input TodoInput {
    title: String!
    description: String
    status: TodoStatus
    dueDate: String
  }

  # ------------------------------
  # Queries and Mutations
  # ------------------------------
  type Query {
    # User queries
    me: User

    # Todo queries
    todo(id: ID!): Todo
    todos(page: Int, limit: Int, search: String, status: TodoStatus): TodoList!
  }

  type Mutation {
    # User mutations
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Todo mutations
    createTodo(input: TodoInput!): Todo!
    updateTodo(id: ID!, input: TodoInput!): Todo!
    deleteTodo(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }
`;

export default typeDefs;
