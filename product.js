const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    onDiscount: { type: Boolean, default: false },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);