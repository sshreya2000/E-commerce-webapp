import mongoose from "mongoose";
import dotenv from "dotenv";
// load all environment variables in our application
dotenv.config();
export const connectToMongooseMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB using Mongoose is connected");
  } catch (err) {
    console.log(err);
  }
};
