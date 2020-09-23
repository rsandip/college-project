import { Schema, model } from 'mongoose';

import paginator from 'mongoose-paginate-v2';

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true },
);

PostSchema.plugin(paginator);

const Post = model('posts', PostSchema);

export default Post;
