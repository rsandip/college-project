import { createWriteStream } from 'fs';
import { parse, join } from 'path';

import { URL } from '../../config';

export default {
  Query: {
    info: (parent, args, context, info) => 'Hello i am image resolver methods',
  },
  Mutation: {
    imageUploader: async (parent, { file }, context, info) => {
      let { filename, createReadStream } = await file;
      let stream = createReadStream();

      let { name, ext } = parse(filename);
      name = name.replace(/([^a-z0-9A-Z ]+)/gi, '-').replace(' ', '_');

      let serverFile = join(
        __dirname,
        `../../uploads/${name}-${Date.now()}${ext}`,
      );

      let writeStream = await createWriteStream(serverFile);
      await stream.pipe(writeStream);

      serverFile = `${URL}${serverFile.split('uploads')[1]}`;

      return serverFile;
    },
  },
};
