import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../errorHandler/errorHandler.middleware.js";

export default class userModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }
  // add user with authentication
  static async SignUp(name, email, password, type) {
    const newuser = new userModel(name, email, password, type);
    users.push(newuser);
    return newuser;
  }
  // get User to login
  static SignIn(email, password) {
    const result = users.find(
      (u) => u.email == email && u.password == password
    );
    return result;
  }
  static getAll() {
    return users;
  }
}
var users = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@ecommerce.com",
    password: "password123",
    type: "seller",
  },
  {
    id: 2,
    name: "Customer User",
    email: "customer@ecommerce.com",
    password: "password123",
    type: "customer",
  },
];
