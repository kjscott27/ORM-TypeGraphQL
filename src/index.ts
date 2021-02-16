import 'reflect-metadata'
import express from 'express';
// import { ApolloServer } from 'apollo-server-express';
// import { buildSchema } from 'type-graphql';

const main = async () => {
  const app = express(); // create express app
  // const apolloServer = new ApolloServer({
  //   schema: await buildSchema({
  //     resolvers: [],
  //     validate: false
  //   }),
  //   context: ({ req, res }) => ({ req, res })
  // }) // create apollo server

  // apolloServer.applyMiddleware({ app }); // create gql endpoints on express

  app.listen(4444, () => {
    console.log('Server started on localhost:4444')
  });
};

main().catch(err => {
  console.error(err)
}); // catch errors and print them in a nicer format