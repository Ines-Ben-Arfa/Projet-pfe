const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId", "title price images");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET orders by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate("products.productId", "title price images");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single order by id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.productId", "title price images");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;