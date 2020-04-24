const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { LOCAL_DATABASE } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(LOCAL_DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server is running on ${res.url}`);
  });
