import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { isAuth } from "./../middleware/isAuth";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    if (!req.session.userId) return null;
    const updoot = await updootLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return updoot ? updoot.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const upValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const updoot = await Updoot.findOne({ where: { postId, userId } });
    if (updoot && updoot.value !== upValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
        UPDATE updoot SET value = ${upValue} WHERE "userId" = ${userId} AND "postId" = ${postId};
        `);
        await tm.query(`
          UPDATE "Post" SET POINTS = POINTS + ${upValue * 2} WHERE ID=${postId};
        `);
      });
    } else if (!updoot) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
        INSERT INTO updoot("userId", "postId", value) VALUES (${userId},${postId},${upValue} );
        `);
        await tm.query(`
        UPDATE "Post" 
        SET POINTS = POINTS + ${upValue} WHERE ID =${postId};
        `);
      });
    }
    return true;
  }

  // Get All posts
  @Query(() => PaginatedPosts)
  async posts(
    // @Ctx() { req }: MyContext,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit) + 1;
    const replacements: any[] = [realLimit + 1];

    // if (req.session.userId) replacements.push(req.session.userId);
    if (cursor) replacements.push(new Date(parseInt(cursor)));

    const posts = await getConnection().query(
      `
      SELECT P.*
      FROM "Post" P
    ${cursor ? `where p."createdAt" < $2` : ``}
      ORDER BY P."createdAt" DESC
      LIMIT $1
    `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimit + 1,
    };
  }

  //   Get post by id
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  //Create Post
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  //Upate Post
  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const post = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id=:id and "creatorId" =:creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    console.log("UPDATED POST ", post);
    return post.raw[0];
  }

  //Delete Post
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
