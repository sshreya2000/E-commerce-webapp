import mongoose from "mongoose";
import { ApplicationError } from "../../errorHandler/errorHandler.middleware.js";
import userSchema from "./user.schema.js";

// creating model using schema
const UserModel = mongoose.model("User", userSchema);
export default class UserRepository {
  async SignUp(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        throw new ApplicationError(500, "Something went wrong");
      }
    }
  }

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something went wrong");
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError(400, "Something went wrong");
    }
  }
  async resetPassword(userID, newPassword) {
    try {
      let user = await UserModel.findById(userID);
      if (user) {
        user.password = newPassword;
        await user.save();
      } else throw new ApplicationError(400, "User Not Found");
    } catch (err) {
      console.log(err);
      throw new ApplicationError(400, "Something went wrong");
    }
  }
}
