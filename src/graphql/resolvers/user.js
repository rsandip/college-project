import { ApolloError } from 'apollo-server-express';
import { hash, compare } from 'bcryptjs';

import { issueToken, serializeUser } from '../../functions/';
import {
  UserAuthenticationRules,
  UserRegistrationRules,
} from '../../validators';

export default {
  Query: {
    authUserProfile: async (parent, {}, { user }, info) => user,
    authenticateUser: async (
      parent,
      { username, password },
      { User },
      info,
    ) => {
      try {
        await UserAuthenticationRules.validate(
          { username, password },
          {
            abortEarly: false,
          },
        );
        // find user by username
        let user = await User.findOne({ username });
        if (!user) {
          throw new ApolloError('Username not found', '403');
        }
        // check for the password
        let isMatch = await compare(password, user.password);
        if (!isMatch) {
          throw new ApolloError('Wrong crdentials');
        }

        // serialize user
        user = user.toObject();
        user.id = user._id;
        user = serializeUser(user);

        // issues new authentication token
        let token = await issueToken(user);
        return {
          token,
          user,
        };
      } catch (err) {
        throw new ApolloError(error.message, '403');
      }
    },
  },
  Mutation: {
    registerUser: async (parent, { newUser }, { User }, info) => {
      await UserRegistrationRules.validate(newUser, {
        abortEarly: false,
      });
      // console.log(User);
      try {
        let { username, email } = newUser;
        // first check if the username is already taken
        let user;
        user = await User.findOne({ username });
        if (user) {
          throw new ApolloError('Username is already taken', '403');
        }
        // if the emaail taken
        user = await User.findOne({ email });
        if (user) {
          throw new ApolloError('Email is already registered', '403');
        }
        // create new User Instance
        user = new User(newUser);

        // hash the password
        user.password = await hash(newUser.password, 12);

        // saave the user to the database
        let result = await user.save();
        result = result.toObject();
        result.id = result._id;
        result = await serializeUser(result);
        // issues the authentication token
        let token = await issueToken(result);
        // console.log(result);
        return {
          token,
          user: result,
        };
      } catch (err) {
        throw new ApolloError(err.message, '400');
      }
    },
  },
};
