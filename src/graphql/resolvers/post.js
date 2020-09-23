import { ApolloError } from 'apollo-server-express';
import { NewPostValidationRules } from '../../validators';

const myCustomLabels = {
  docs: 'posts',
  limit: 'perpage',
  nextPage: 'next',
  prevPage: 'prev',
  meta: 'paginator',
  page: 'currentPage',
  padingCounter: 'slNo',
  totalDocs: 'postCount',
  totalPages: 'pageCount',
};

export default {
  Query: {
    getAllPosts: async (parent, args, { Post }, info) => {
      let posts = await Post.find().populate('author');
      return posts;
    },
    getPostById: async (parent, { id }, { Post }, info) => {
      try {
        let post = await Post.findById(id);
        if (!post) {
          throw new Error('Post not found');
        }
        await post.populate('author').execPopulate();
        return post;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    getPostByLimitAndPage: async (parent, { page, limit }, { Post }, info) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: {
          createdAt: -1,
        },
        populate: 'author',
        customLabels: myCustomLabels,
      };

      let posts = await Post.paginate({}, options);
      return posts;
    },
    getAuthenticatedUserPosts: async (
      parent,
      { page, limit },
      { Post, user },
      info,
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: {
          createdAt: -1,
        },
        populate: 'author',
        customLabels: myCustomLabels,
      };

      let posts = await Post.paginate(
        {
          author: user._id.toString(),
        },
        options,
      );
      return posts;
    },
  },
  Mutation: {
    createNewPost: async (parent, { postInput }, { Post, user }, info) => {
      await NewPostValidationRules.validate(postInput, { abortEarly: false });
      // user._id = user._id.toString();
      let result = await Post.create({
        ...postInput,
        author: user._id.toString(),
      });
      await result.populate('author').execPopulate();
      return result;
    },
    editPostById: async (parent, { postInput, id }, { Post, user }, info) => {
      try {
        await NewPostValidationRules.validate(postInput, { abortEarly: false });
        let editedPost = await Post.findOneAndUpdate(
          { _id: id, author: user._id },
          { ...postInput },
          { new: true },
        );
        await editedPost.populate('author').execPopulate();
        if (!editedPost) {
          throw new Error('Unable to edit the post');
        }
        return editedPost;
      } catch (err) {
        throw new ApolloError(err.message, '400');
      }
    },
    deletePostById: async (parent, { id }, { Post, user }, info) => {
      try {
        let deletedPost = await Post.findOneAndDelete({
          _id: id,
          author: user._id,
        });
        await deletedPost.populate('author').execPopulate();
        if (!deletedPost) {
          throw new Error('Unable to delete the post');
        }
        return {
          success: true,
          id: deletedPost.id,
          message: 'Your posts is deleted',
        };
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
};
