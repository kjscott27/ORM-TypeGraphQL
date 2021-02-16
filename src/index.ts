import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import { HelloResolver } from './resolvers/hello';
import mikroConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { PostResolver } from './resolvers/posts';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    context: () => ({ em: orm.em })
  })

  apolloServer.applyMiddleware({ app });

  app.listen(4444, () => {
    console.log('server started on localhost:4444');
  });
};

main().catch(err => {
  console.error(err)
});