import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);
let db = null;

try {
  await mongoClient.connect();
  db = mongoClient.db("llrb-crew");
  console.log(`Connected to llrb crew mongoDB database`);
} catch (e) {
  console.log(`Failed to connect to llrb crew mongoDB database`, e);
}
export default db;