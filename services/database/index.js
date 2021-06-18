import mongodb from "mongodb";

import dotenv from "dotenv";
dotenv.config();

const client = new mongodb.MongoClient(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

await client.connect();

process.on("exit", () => {
  client.close();
});

export default client.db(process.env.MONGODB_DATABASE_NAME);
