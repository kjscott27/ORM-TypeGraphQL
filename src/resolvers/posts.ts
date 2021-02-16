import { ContextType } from '../globals/types';
import { Resolver, Query, Ctx } from 'type-graphql';
import { Post } from './../entities/post';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx() { em }: ContextType
  ) {
    return em.find(Post, {});
  }
}