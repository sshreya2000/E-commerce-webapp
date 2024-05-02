import { MongoClient } from "mongodb";
import dotenv from "dotenv";
// load all environment variables in our application
dotenv.config();
let clientdb;
export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((client) => {
      clientdb = client;
      console.log("MongoDB is connected");
      createCounter(clientdb.db());
      createIndexes(clientdb.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient = () => {
  return clientdb;
};
export const getDB = () => {
  return clientdb.db();
};

// export const closeMongoDBConnection = async () => {
//   try {
//     if (client) {
//       await client.close();
//       console.log("MongoDB connection closed");
//     } else {
//       console.warn("MongoDB client not available for closing");
//     }
//   } catch (err) {
//     console.error("Error closing MongoDB connection:", err);
//   }
// };

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter)
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
};

const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 }); //single indexes
    await db.collection("products").createIndex({ name: 1, category: -1 }); //compound indexes
    await db.collection("products").createIndex({ desc: "text" }); //text indexes
  } catch (err) {
    console.log(err);
  }
  console.log("Indexes are created");
};
