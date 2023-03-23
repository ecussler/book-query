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
        return User.findOne({ _id: context.user._id }).populate("thoughts");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
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
    addUser: async (parent, { username, email }) => {
        const user = await User.create({ username, email }); 
        const token = signToken(user); 
        return { token, user }; 
    },
    saveBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const book = await Book.findOne({ bookId }); 

            await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: book.bookId } },
            ); 
        }
        throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const book = await Book.findOneAndDelete({ bookId }); 

            await User.findOneAndUpdate(
                { _id: context.user._id }, 
                { $pull: { savedBooks: book._id} }
            );

            return book; 

        }
        throw new AuthenticationError('You need to be logged in!');
    }
  }
};
