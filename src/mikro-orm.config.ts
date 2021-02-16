import { Post } from "./entities/Post";
import { runningInProduction } from "./globals/constants";
import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';
import { User } from "./entities/user";

export default {
  entities: [Post, User],
  dbName: 'lireddit',
  type: 'postgresql',
  debug: !runningInProduction,
  user: 'postgres',
  password: 'postgres',
  migrations: {
    path: join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  }
} as Parameters<typeof MikroORM.init>[0];