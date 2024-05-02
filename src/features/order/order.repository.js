import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/errorHandler.middleware.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }
  async placeOrder(userID) {
    const clientdb = getClient();
    const session = clientdb.startSession();
    try {
      const db = getDB();
      session.startTransaction();
      // get cart items and calculate total amount
      const items = await this.getTotalAmount(userID, session);
      const finalTotalAmt = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmt);
      // create an order record
      const newOrder = new OrderModel(
        new ObjectId(userID),
        finalTotalAmt,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, session);
      // reduce the stock
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }
      // throw new Error("Something wrong with placeOrder");
      // clear the cart
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userID),
        },
        { session }
      );
      session.commitTransaction();
      session.endSession();
      return;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError(400, "Something went wrong");
    }
  }
  async getTotalAmount(userID, session) {
    const db = getDB();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          {
            //match all products of the user
            $match: { userID: new ObjectId(userID) },
          },
          {
            // retrieve all products from products using product id in cart
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          {
            // unwinds the array of products in cart
            $unwind: "$productInfo",
          },
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
        { session }
      )
      .toArray();
    return items;
  }
}
