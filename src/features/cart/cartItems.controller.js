import CartItemModel from "./cartItems.model.js";
import CartItemRepository from "./cartItems.repository.js";

export class CartItemsController {
  constructor() {
    this.cartItemRepository = new CartItemRepository();
  }
  async add(req, res) {
    try {
      const { productID, quantity } = req.query;
      const userID = req.userID;
      const item = new CartItemModel(productID, userID, Number(quantity));
      await this.cartItemRepository.add(item);
      res.status(201).send("Cart is updated");
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something is wrong");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartItemRepository.get(userID);
      if (items) return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something is wrong");
    }
  }

  async delete(req, res) {
    try {
      const userID = req.userID;
      const cartItemID = req.params.id;
      const cartItem = await this.cartItemRepository.delete(cartItemID, userID);
      if (cartItem) {
        return res.status(200).send("Cart item is removed");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError(500, "Something is wrong");
    }
  }
}
