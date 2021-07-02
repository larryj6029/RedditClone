import { MyContext } from "src/types";
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
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = async () => {
  // Server set up
  const app = express();

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      }, //10 years
      saveUninitialized: false,
      secret: "Rocks",
      resave: false,
    })
  );

  // Database setup
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log("server started on localhost:5000");
  });
};

main().catch((err) => {
  console.log(err);
});
