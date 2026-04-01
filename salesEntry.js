const mongoose = require("mongoose");

const salesEntrySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productTitle: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  unitPrice: { 
    type: Number, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true 
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  vatPercent: { 
    type: Number, 
    default: 20 
  },
  vatAmount: { 
    type: Number, 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    default: "confirmed" 
  },
});

// 🔥 Third parameter forces Mongoose to use your existing "orders" collection
module.exports = mongoose.model("SalesEntry", salesEntrySchema, "orders");