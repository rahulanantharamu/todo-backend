import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema/typeDefs";       
import { resolvers } from "./controllers";      
import sequelize from "./config/database";
import { authMiddleware } from "./middlewares/auth";

async function startServer() {
  const app: express.Application = express();   

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = authMiddleware({req});
      return { userId: user ? user.userId : null };
    },
  });

  await server.start();
    server.applyMiddleware({ app: app as any });

  try {
    await sequelize.sync();
    console.log("Database connected & synced successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
