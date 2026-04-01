import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaHistory, FaTimes } from "react-icons/fa";
import "../styles/orders.css";
import Invoice from "../components/invoice";

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  /* 🔥 LOAD PRODUCTS */
  useEffect(() => {
    axios
      .get("http://localhost:3636/api/products")
      .then((res) => {
        setProducts(res.data);
        if (res.data.length) setSelectedCategory(res.data[0].category);
      })
      .catch((err) => console.error(err));
  }, []);

  /* 🔥 LOAD HISTORY FROM LOCAL STORAGE */
  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("ordersHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  /* 🔥 ADD TO CART */
  const addToCart = (product) => {
    const qty = Math.max(1, quantities[product._id] || 1);
    const existing = cart.find((p) => p._id === product._id);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + qty > product.stock) return;

    if (existing) {
      setCart((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + qty }
            : p
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: qty }]);
    }
  };

  const totalBefore = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const totalAfter = cart.reduce(
    (acc, p) => acc + (p.onDiscount ? p.discount : p.price) * p.quantity,
    0
  );

  const cancelOrder = () => {
    setCart([]);
    setQuantities({});
    setStep(1);
  };

  /* 🔥 FINISH ORDER: SHOW INVOICE MODAL */
  const finishOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cart.length,
      totalBefore,
      totalAfter,
      products: cart,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    };

    setCurrentInvoice(newOrder);
    setInvoiceOpen(true); // open modal for input
  };

  /* 🔥 HANDLE CONFIRM FROM INVOICE */
  const handleConfirmInvoice = (confirmedOrder) => {
    const updatedHistory = [confirmedOrder, ...history];
    localStorage.setItem("ordersHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    setCart([]);
    setStep(1);
    setInvoiceOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <div className="orders-header">
        <h2>Orders Management</h2>
        <div className="history-btn" onClick={() => setHistoryOpen(true)}>
          <FaHistory />
          Orders History
        </div>
      </div>

      {/* HISTORY MODAL */}
      {historyOpen && (
        <div className="history-overlay">
          <div className="history-modal">
            <div className="history-header">
              <h2>Orders History</h2>
              <FaTimes onClick={() => setHistoryOpen(false)} />
            </div>

            {history.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              history.map((order) => (
                <div key={order.id} className="history-card">
                  <div>{order.date}</div>
                  <div>{order.items} items</div>
                  <div className="price">
                    <span className="old-red">${order.totalBefore}</span>
                    <span className="new">${order.totalAfter}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {invoiceOpen && currentInvoice && (
        <Invoice
          order={currentInvoice}
          onClose={() => setInvoiceOpen(false)}
          onConfirm={handleConfirmInvoice}
        />
      )}

      {/* ORDERS PAGE */}
      <div className="orders-page">
        {/* PROCESS */}
        <div className="process-line">
          {["Products", "Confirm", "Invoice"].map((s, i) => (
            <div
              key={i}
              className={`step ${
                step === i + 1 ? "active" : step > i + 1 ? "done" : ""
              }`}
            >
              <div className="circle">
                {step > i + 1 ? <FaCheckCircle /> : i + 1}
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="orders-container">
          {/* LEFT: PRODUCTS */}
          <div className="products-section">
            <div className="category-tree">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={`cat-item ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>

            <div className="products-grid">
              {products
                .filter((p) => p.category === selectedCategory)
                .map((p) => {
                  const qty = quantities[p._id] || 1;
                  const inCart = cart.find((c) => c._id === p._id)?.quantity || 0;
                  const isAvailable = qty + inCart <= p.stock;

                  return (
                    <div className="product-card" key={p._id}>
                      <img src={p.images[0]} alt={p.title} />
                      <h4>{p.title}</h4>

                      <div className="price">
                        {p.onDiscount && <span className="old-red">${p.price}</span>}
                        <span className="new">${p.onDiscount ? p.discount : p.price}</span>
                      </div>

                      <div className="qty">
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value) || 1);
                            setQuantities({ ...quantities, [p._id]: value });
                          }}
                        />
                        <button onClick={() => addToCart(p)} disabled={!isAvailable}>
                          Add
                        </button>
                      </div>

                      {isAvailable ? (
                        <div className="ok">✔ Available</div>
                      ) : (
                        <div className="error">❌ Not enough stock</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* RIGHT: CART */}
          <div className="cart-panel">
            <h3>Current Order</h3>

            {cart.length === 0 ? (
              <p>No items</p>
            ) : (
              <>
                {cart.map((p) => (
                  <div key={p._id} className="cart-item">
                    <img src={p.images[0]} alt={p.title} />
                    <div className="cart-info">
                      <span>{p.title}</span>
                      <span>x{p.quantity}</span>
                    </div>
                    <div className="cart-price">
                      {p.onDiscount && (
                        <span className="old-red">${p.price * p.quantity}</span>
                      )}
                      <span className="new">
                        ${(p.onDiscount ? p.discount : p.price) * p.quantity}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="total">
                  <span className="old-red">${totalBefore}</span>
                  <span className="new">${totalAfter}</span>
                </div>

                {step === 1 && (
                  <button className="main-btn" onClick={() => setStep(2)}>
                    Continue →
                  </button>
                )}

                {step === 2 && (
                  <div className="actions">
                    <button className="cancel-btn" onClick={cancelOrder}>
                      Cancel
                    </button>
                    <button className="main-btn" onClick={() => setStep(3)}>
                      Confirm Order
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <button className="main-btn" onClick={finishOrder}>
                    Finish & Save
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}