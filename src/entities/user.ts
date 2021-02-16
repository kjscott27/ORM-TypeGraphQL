import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Int, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {

  @Field(() => Int)
  @PrimaryKey()
  id!: number; // string is also supported

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ type: 'text', unique: true })
  username!: string;

  @Property({ type: 'text' })
  password!: string;
}
