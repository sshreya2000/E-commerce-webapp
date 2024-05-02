import userModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class userController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new userModel(name, email, hashedPassword, type);
      await this.userRepository.SignUp(user);
      res.status(201).send(user);
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findByEmail(email);
      if (!user) return res.status(400).send("Incorrect Credentials");
      else {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          // generate token
          const token = jwt.sign(
            { userID: user._id, userEmail: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const userID = req.userID;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      return res.status(200).send("Password is reset");
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }
}
