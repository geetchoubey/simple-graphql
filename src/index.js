import {ApolloServer, gql, PubSub} from 'apollo-server'
import fs from 'fs'
import glob from 'glob'
import path from 'path'

import db from './db'
import resolvers from './resolver';

const directoryPath = path.join(__dirname, 'schema', '*.graphql')
const typeDefs = gql`${glob.sync(directoryPath)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .reduce((typeDefs, typeDef) => `${typeDefs}\n${typeDef}`, '# My Awesome SDL')}`

let pubSub = new PubSub()

let server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    db,
    pubSub
  }
});
server.listen().then(info => console.log(info.url));