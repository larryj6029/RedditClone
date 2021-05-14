import { PostResolver } from "./resolvers/post";
import "reflect-metadata";
import { HelloResolver } from "./resolvers/hello";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import microConfig from "./mikro-orm.config";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  // Server set up
  const app = express();

  // Database setup
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log("server started on localhost:5000");
  });
};

main().catch((err) => {
  console.log(err);
});
