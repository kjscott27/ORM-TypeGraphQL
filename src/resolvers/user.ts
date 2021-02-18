import { ContextType } from '../globals/types';
import { Resolver, Ctx, Arg, Mutation, ObjectType, Field } from 'type-graphql';
import { User } from '../entities/user';
import argon2 from 'argon2';

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { em }: ContextType
  ): Promise<UserResponse> {
    let errors: [] | FieldError[] = [];

    if (username.length <= 2) {
      errors = [{ field: 'username', message: 'length of username must be greater than 2' }];
    }

    if (password.length <= 2) {
      errors = [...errors, { field: 'password', message: 'length of password must be greater than 2' }];
    }

    if (errors.length > 0) {
      return {
        errors
      }
    }

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });

    try {
      await em.persistAndFlush(user);
    } catch (e) {
      if (e.code === '23505' || e.detail.includes("already exists")) {
        // duplicate username error
        return {
          errors: [{ field: 'username', message: 'username already taken' }]
        }
      }
      console.log(e.message);
    }

    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { em }: ContextType
  ): Promise<UserResponse> {

    const user = await em.findOne(User, { username });

    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'username does not exist'
        }]
      }
    }

    const valid = await argon2.verify(user.password, password)

    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'you have entered incorrect credentials' }]
      }
    }

    return {
      user
    };
  }

}