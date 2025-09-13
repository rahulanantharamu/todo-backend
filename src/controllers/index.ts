import { userResolvers } from "./userController";
import { todoResolvers } from "./todoController";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...todoResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...todoResolvers.Mutation,
  },
};
