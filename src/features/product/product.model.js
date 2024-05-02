import userModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, price, imageURL, category, sizes, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageURL = imageURL;
    this.category = category;
    this.sizes = sizes;
  }

  static getAll() {
    return products;
  }
  static get(id) {
    const product = products.find((p) => p.id == id);
    return product;
  }

  static filter(minPrice, maxPrice, category) {
    const result = products.filter((p) => {
      return (
        (!minPrice || p.price >= minPrice) &&
        (!maxPrice || p.price <= maxPrice) &&
        (!category || p.category == category)
      );
    });
    return result;
  }

  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static rateProduct(userID, productID, rating) {
    const user = userModel.getAll().find((u) => u.id == userID);
    if (!user) return "User not found";
    const product = products.find((p) => p.id == productID);
    if (!product) return "Product not found";
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userID: userID,
        rating: rating,
      });
    } else {
      const rateExist = product.ratings.findIndex((r) => r.userID == userID);
      if (rateExist >= 0) {
        product.ratings[rateExist] = {
          userID: userID,
          rating: rating,
        };
      } else {
        product.ratings.push({
          userID: userID,
          rating: rating,
        });
      }
    }
  }
}
var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "Category1"
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "Category2",
    ["M", "XL"]
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category3",
    ["M", "XL", "S"]
  ),
];
