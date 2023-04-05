const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // Returns single user by ID
    user: async (parent, { _id }) => {
      return User.findOne({ _id }).populate('savedBooks')
    },
    // Returns logged in user
    me: async (parent, args, context) => {
      if (context.user) {
        const me = await User.findOne({ _id: context.user._id }).populate("savedBooks");
        console.log(me); 
        return me; 
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // books: async(parent, args, context) => {
    //   return await Book.
    // }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email }); 
        // Throw error if no user with that email found
        if (!user) {
            throw new AuthenticationError('No user found with that email address.');
        }

        const correctPw = await user.isCorrectPassword(password); 
        // Throw error if password is incorrect
        if (!correctPw) {
            throw new AuthenticationError('Incorrect password'); 
        }

        const token = signToken(user); 

        return { token, user }; 
    }, 
    addUser: async (parent, args) => {
        const user = await User.create(args); 
        const token = signToken(user); 
        return { token, user }; 
    },
    saveBook: async (parent, args, context) => {
        if (context.user) {
            const updatedUser =  await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args } },
                { new: true }
            ); 
            
            return updatedUser; 
        }

        throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, args, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id }, 
                { $pull: { savedBooks: { bookId: args.bookId } } }, 
                { new: true }
            );

            return updatedUser; 

        }
        throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers; 
