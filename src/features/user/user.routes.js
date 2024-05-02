// Manage routes/paths to UserController

// 1. Import express.
import express from "express";
import userController from "./user.controller.js";
import { jwtAuthorizer } from "../../middlewares/jwtAuth.middleware.js";

// 2. Initialize Express router.
const userRouter = express.Router();
const UserController = new userController();

// All the paths to the controller methods.
userRouter.post("/signup", (req, res) => {
  UserController.signUp(req, res);
});
userRouter.post("/signin", (req, res) => {
  UserController.signIn(req, res);
});
userRouter.put("/resetPassword", jwtAuthorizer, (req, res) => {
  UserController.resetPassword(req, res);
});

export default userRouter;
