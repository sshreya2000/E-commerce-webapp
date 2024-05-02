import { ApplicationError } from "../../errorHandler/errorHandler.middleware.js";
import { getDB } from "../../config/mongodb.js";

class UserRepository {
  constructor() {
    this.collection = "users";
  }
  async SignUp(newuser) {
    try {
      const db = getDB(); //get the db
      const collection = db.collection(this.collection); //get the collection
      // users.push(newuser);
      await collection.insertOne(newuser);
      return newuser;
    } catch (err) {
      throw new ApplicationError(400, "Something went wrong");
    }
  }

  async SignIn(email, password) {
    try {
      const db = getDB(); //get the db
      const collection = db.collection(this.collection); //get the collection
      return await collection.findOne({ email, password });
    } catch (err) {
      throw new ApplicationError(400, "Something went wrong");
    }
  }
  async findByEmail(email) {
    // Write your code here
    try {
      const db = getDB(); //get the db
      const collection = db.collection("users"); //get the collection
      return await collection.findOne({ email });
    } catch (err) {
      throw new ApplicationError(400, "Something went wrong");
    }
  }
}
export default UserRepository;
