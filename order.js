const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // or ObjectId if you have a Users collection
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }, // store price at time of order
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" }, // pending, shipped, delivered, canceled
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);