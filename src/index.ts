import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  // const post = orm.em.create(Post, { title: "First post" });
  // await orm.em.persistAndFlush(post);

  //? Gets all posts in db
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.log(err);
});