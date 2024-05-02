import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, desc, price, category, sizes } = req.body;
      console.log(name + desc + price + category + sizes);
      console.log(req.file.filename);
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req.file.filename,
        category,
        sizes.split(",")
      );
      console.log(newProduct);
      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }

  async rateProduct(req, res) {
    try {
      const userID = req.userID;
      const productID = req.query.productID;
      const rating = req.query.rating;
      const product = await this.productRepository.rate(
        userID,
        productID,
        rating
      );
      console.log(product);
      if (product) return res.status(200).send("Rating has been added");
      else return res.status(400).send("Something went wrong");
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (product) res.status(200).send(product);
      else return res.status(404).send("Product not found");
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const products = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      if (products) res.status(200).send(products);
      else res.status(400).send("No products available");
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }

  async averagePrice(req, res) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  }
}
