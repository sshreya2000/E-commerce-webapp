import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/errorHandler.middleware.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";
import mongoose from "mongoose";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      console.log(newProduct);
      const db = getDB(); //get the db
      const collection = db.collection(this.collection); //get the collection
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (err) {
      throw new ApplicationError(400, "Something went wrong");
    }
  }
  async getAll() {
    try {
      const db = getDB(); //get the db
      const collection = db.collection(this.collection); //get the collection
      return await collection.find().toArray();
    } catch (err) {
      throw new ApplicationError(500, "Something went wrong");
    }
  }
  async get(id) {
    try {
      const db = getDB(); //get the db
      const collection = db.collection(this.collection); //get the collection
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new ApplicationError(500, "Something went wrong");
    }
  }
  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      return await collection.find(filterExpression).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something went wrong with database");
    }
  }

  async rate(userID, productID, rating) {
    try {
      // const db = getDB(); //get the db
      // const collection = db.collection(this.collection); //get the collection
      // const product = await collection.findOne({
      //   _id: new ObjectId(productID),
      // });
      // const userRating = product?.ratings?.find((r) => r.userID == userID);
      // if (userRating) {
      //   return await collection.updateOne(
      //     {
      //       _id: new ObjectId(productID),
      //       "ratings.userID": new ObjectId(userID),
      //     },
      //     { $set: { "ratings.$.rating": Number(rating) } }
      //   );
      // } else {
      //   return await collection.updateOne(
      //     { _id: new ObjectId(productID) },
      //     {
      //       $push: {
      //         ratings: { userID: new ObjectId(userID), rating: Number(rating) },
      //       },
      //     }
      //   );
      // }

      // 1. Check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found");
      }

      // Find the existing review
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        newReview.save();
      }
    } catch (err) {
      throw new ApplicationError(500, "Something went wrong");
    }
  }
  async averageProductPricePerCategory() {
    try {
      const db = getDB(); //get the db
      const collection = db.collection(this.collection); //get the collection
      return await collection
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      throw new ApplicationError(400, "Something went wrong");
    }
  }
}
export default ProductRepository;
