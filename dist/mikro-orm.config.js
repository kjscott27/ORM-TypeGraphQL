"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const constants_1 = require("./globals/constants");
const path_1 = require("path");
const user_1 = require("./entities/user");
exports.default = {
    entities: [Post_1.Post, user_1.User],
    dbName: 'lireddit',
    type: 'postgresql',
    debug: !constants_1.runningInProduction,
    user: 'postgres',
    password: 'postgres',
    migrations: {
        path: path_1.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    }
};
//# sourceMappingURL=mikro-orm.config.js.map