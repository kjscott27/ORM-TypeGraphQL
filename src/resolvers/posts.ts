import { ContextType } from '../globals/types';
import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Post } from './../entities/post';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx() { em }: ContextType
  ) {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx() { em }: ContextType
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: ContextType
  ): Promise<Post> {
    const post = em.create(Post, { title });

    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: ContextType
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });

    if (!post) {
      return null;
    }

    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }


  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: ContextType
  ): Promise<boolean> {
    em.nativeDelete(Post, { id });

    // you could do some try-catch stuff in here
    // but really for it's not worth it for a demo/hobby app

    return true;
  }

}