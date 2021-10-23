import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from './constants';
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from "express";
import { HelloResolver } from './resolvers/hello';
import { PostsResolver } from "./resolvers/posts";
import { UserResolver } from './resolvers/user';

const main = async () => {

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    // const post = orm.em.create(Post, { name: "My first post" });
    // await orm.em.persistAndFlush(post);
    // console.log("----------sql 2-----------");
    // await orm.em.nativeInsert(Post, { name: "My second post" });
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);


    const app = express();
    // app.get('/', (_, res) => {
    //     res.send('running');
    // })
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostsResolver, UserResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('PORT 4000 ACTIVE NOW!!')
    });

};

main().catch(err => {
    console.log(err);
})