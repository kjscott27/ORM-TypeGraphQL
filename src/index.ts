import 'reflect-metadata'
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import mikroConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { PostResolver } from './resolvers/posts';
import { UserResolver } from './resolvers/user';
import { runningInProduction } from './globals/constants';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // the session middleware needs to run before the apollo middleware
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        //
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // CSRF protection
        secure: runningInProduction // cookie only on https
      },
      secret: 'keyboard cat',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app });

  app.listen(4444, () => {
    console.log('server started on localhost:4444');
  });
};

main().catch(err => {
  console.error(err)
});