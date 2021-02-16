import { ContextType } from '../globals/types';
import { Resolver, Ctx, Arg, Mutation } from 'type-graphql';
import { User } from '../entities/user';
import argon2 from 'argon2';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async registerUser(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { em }: ContextType
  ): Promise<User> {

    const hashedPassword = argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });
    await em.persistAndFlush(user);
    return user;
  }

}