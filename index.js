// import files

import express from "express";
import swagger from "swagger-ui-express";
import ProductRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import bodyParser from "body-parser";
import { basicAuthorizer } from "./src/middlewares/basicAuth.middleware.js";
import { jwtAuthorizer } from "./src/middlewares/jwtAuth.middleware.js";
import cartRouter from "./src/features/cart/cartItems.routes.js";
import apiDocs from "./swagger.json" assert { type: "json" };
import { connectToMongoDB } from "./src/config/mongodb.js";
import errorHandlerMiddleware from "./src/errorHandler/errorHandler.middleware.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectToMongooseMongoDB } from "./src/config/mongoConfig.js";

// create server
const app = express();

// to parse req bod to post correctly
app.use(bodyParser.json());
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
// for all requests related to product, redirect to product routes.
// localhost:4000/api/products
app.use("/api/products", jwtAuthorizer, ProductRouter);
app.use("/api/cartItems", jwtAuthorizer, cartRouter);
app.use("/api/orders", jwtAuthorizer, orderRouter);
app.use("/api/users", userRouter);

// default request handler
app.get("/", (req, res) => {
  res.send("Welcome to ecommerce app");
});
// error Handler
app.use(errorHandlerMiddleware);
// server port
app.listen(4000, () => {
  console.log("Server is listening on port 4000");
  // connectToMongoDB();
  connectToMongooseMongoDB();
});
