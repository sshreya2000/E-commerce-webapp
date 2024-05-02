import OrderRepository from "./order.repository.js";

export default class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }
  async placeOrder(req, res) {
    try {
      const userID = req.userID;
      await this.orderRepository.placeOrder(userID);
      res.status(201).send("Order is Placed");
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }
}
