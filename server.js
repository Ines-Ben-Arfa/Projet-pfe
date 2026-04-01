const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./routes/admin"); // router for admin
const authRoutes = require("./middleware/auth"); // router for auth (login)
const employeeRoutes = require("./routes/employees");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/products"); // router for products
const Order = require("./models/salesEntry");
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/", adminRoutes);          // admin routes first
app.use("/api/auth", authRoutes);   // auth routes
app.use("/api/admin/employees", employeeRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/products" , productRoutes);

//save order
// save order
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, products, vatPercent, vatAmount, total } = req.body;

    const savedEntries = [];

    for (let p of products) {
      const newEntry = new Order({
        productId: p.productId,
        productTitle: p.productTitle, // ← FIXED HERE
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalPrice: p.totalPrice,
        customerName,
        customerEmail,
        customerPhone,
        vatPercent: p.vatPercent || vatPercent,
        vatAmount: p.vatAmount || vatAmount,
        total: p.total || total,
        status: "confirmed",
      });

      const saved = await newEntry.save();
      savedEntries.push(saved);
    }

    res.status(201).json(savedEntries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3636;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));