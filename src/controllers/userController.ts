import { AuthenticationError } from 'apollo-server-express';
import { signupUser, loginUser, getUserById } from '../services/userService';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context || !context.userId) {
        throw new AuthenticationError('Not authenticated');
      }
      return await getUserById(context.userId);
    },
  },

  Mutation: {
    signup: async (_: any, { input }: any) => {
      const { name, email, password } = input;
      const result = await signupUser(name, email, password);
      return result;
    },

    login: async (_: any, { input }: any) => {
      const { email, password } = input;
      const result = await loginUser(email, password);
      return result;
    },
  },
};

export default userResolvers;
