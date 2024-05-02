// Manage routes/paths to ProductController

// 1. Import express.
import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

// 2. Initialize Express router.
const router = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.
// localhost/api/products
router.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
router.post("/", upload.single("imageURL"), (req, res) => {
  productController.addProduct(req, res);
});
router.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res);
});
router.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});
router.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});

export default router;
