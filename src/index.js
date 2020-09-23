import { join } from 'path';
import { success, error } from 'consola';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { PORT, IN_PROD, DB_URI } from './config';
import { resolvers, typeDefs } from './graphql';

import { schemaDirectives } from './graphql/directives';
import AuthMiddleware from './middlewares/auth';

import mongoose from 'mongoose';
import * as AppModels from './models';

// initialize express
const app = express();
app.use(AuthMiddleware);
app.use(express.json());
app.use(express.static(join(__dirname, './uploads')));

app.get('/posts', async (req, res) => {
  let { Post } = AppModels;
  let { page, limit } = req.query;

  const myCustomLabels = {
    totalDocs: 'postCount',
    docs: 'posts',
    limit: 'perpage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    padingCounter: 'slNo',
    meta: 'paginator',
  };

  const options = {
    page: page || 1,
    limit: limit || 10,
    customLabels: myCustomLabels,
  };

  await Post.paginate({}, options);
  return res.json(posts);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: IN_PROD,
  context: ({ req }) => {
    let { isAuth, user } = req;
    return {
      user,
      isAuth,
      req,
      ...AppModels,
    };
  },
});

const startApp = async () => {
  // inject apollo server middleware on express application

  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    success({
      message: 'Successfully connected with database',
      badge: true,
    }),
      server.applyMiddleware({ app });
    app.listen(PORT, () =>
      success({
        message: 'Server started on http://localhost:' + PORT,
        badge: true,
      }),
    );
  } catch (err) {
    error({
      message: err.message,
      badge: true,
    });
  }
};

startApp();
