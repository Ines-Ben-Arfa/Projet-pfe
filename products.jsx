import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/products.css";

export default function Products({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3636/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFiltered(products.filter((p) => p.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="products-dashboard">
      {filtered.length === 0 ? (
        <p className="select-category-msg">No products in this category yet!</p>
      ) : (
        <motion.div
          className="products-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={selectedCategory} // triggers re-animation when category changes
        >
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div
                className="product-card"
                key={product._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="image-container">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="product-image"
                  />
                  {product.onDiscount && (
                    <span className="discount-badge">
                      -${product.price - product.discount}
                    </span>
                  )}
                  {product.stock <= 5 && (
                    <span className="stock-badge">Low Stock</span>
                  )}
                </div>
                <h3 title={product.title}>{product.title}</h3>
                <p className="description" title={product.description}>
                  {product.description.length > 80
                    ? product.description.slice(0, 80) + "..."
                    : product.description}
                </p>
                <p className="price">
                  ${product.onDiscount ? product.discount : product.price}{" "}
                  {product.onDiscount && (
                    <span className="original-price">${product.price}</span>
                  )}
                </p>
                <p
                  className={`stock ${
                    product.stock > 0 ? "in-stock" : "out-stock"
                  }`}
                >
                  {product.stock} units
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}