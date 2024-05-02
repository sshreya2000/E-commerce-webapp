import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/errorHandler.middleware.js";

export default class CartItemRepository {
  constructor() {
    this.collection = "cartItems"; // name of the collection in mongodb
  }
  async add(item) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      await collection.updateOne(
        {
          productID: new ObjectId(item.productID),
          userID: new ObjectId(item.userID),
        },
        { $setOnInsert: { _id: id }, $inc: { quantity: item.quantity } },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something went wrong with database");
    }
  }
  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find({ userID: new ObjectId(userID) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something went wrong with database");
    }
  }
  async delete(cartItemID, userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.deleteOne({
        _id: new ObjectId(cartItemID),
        userID: new ObjectId(userID),
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something went wrong with database");
    }
  }
  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    console.log(resultDocument);
    return resultDocument.value;
  }
}
