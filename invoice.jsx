import React, { useState } from "react";
import "../styles/invoice.css";
import axios from "axios";
import html2pdf from "html2pdf.js";
export default function Invoice({ order, onClose, addToHistory }) {
  const [customerName, setCustomerName] = useState(order.customerName || "");
  const [customerEmail, setCustomerEmail] = useState(order.customerEmail || "");
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone || "");
  const [successMessage, setSuccessMessage] = useState(""); // popup message

  const VAT_PERCENT = 20;
  const vatAmount = (order.totalAfter * VAT_PERCENT) / 100;

  // Called when Confirm & Save is clicked
  const handleConfirmAndSave = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      setSuccessMessage("Please fill in all customer information!");
      return;
    }

    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      products: order.products.map((p) => ({
  productId: p._id,
  productTitle: p.title,
  quantity: p.quantity,
  unitPrice: p.onDiscount ? p.discount : p.price,
  totalPrice: (p.onDiscount ? p.discount : p.price) * p.quantity,
})),
      items: order.items,
      totalBefore: order.totalBefore,
      totalAfter: order.totalAfter,
      vatPercent: VAT_PERCENT,
      vatAmount: vatAmount,
      total: order.totalAfter + vatAmount,
      status: "confirmed",
      date: order.date,
    };

    try {
      // Save to DB
      await axios.post("http://localhost:3636/api/orders", orderData);

      // Add to local history
      addToHistory(orderData);

      // Show success popup
      setSuccessMessage("Order saved successfully!");

      // Close modal after a short delay
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error saving order:", err);
      setSuccessMessage("Failed to save order to the database.");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };
  const downloadPDF = () => {
  const element = document.querySelector(".invoice-modal");

  element.classList.add("pdf-mode"); // hide buttons

  const opt = {
    margin: 0.5,
    filename: "invoice-smartops.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      element.classList.remove("pdf-mode"); // restore UI
    });
};

  return (
    <div className="invoice-overlay">
      <div className="invoice-modal">
        <div className="invoice-header">
          <h1>SmartOps Invoice</h1>
        </div>

        <div className="invoice-company-customer">
          <div className="company-info">
            <h2>Company Details</h2>
            <h3>SmartOps</h3>
            <p>123 Innovation Blvd, Tech City</p>
            <p>smartops.contact@smartops.com</p>
            <p>+216 54 261 885</p>
          </div>

          <div className="customer-info">
            <h3>Customer Details</h3>
            <label>Customer's Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <label>Customer's Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <label>Customer's Phone</label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="invoice-products">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.quantity}</td>
                  <td>${p.onDiscount ? p.discount : p.price}</td>
                  <td>${(p.onDiscount ? p.discount : p.price) * p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${order.totalAfter.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>VAT ({VAT_PERCENT}%):</span>
            <span>${vatAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(order.totalAfter + vatAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="invoice-actions no-print">
  <button className="close-btn" onClick={onClose}>
    Cancel
  </button>
  <button className="main-btn" onClick={handleConfirmAndSave}>
    Confirm & Save Order
  </button>
</div>

        {/* SUCCESS POPUP */}
        {successMessage && (
  <div className="invoice-success-popup no-print">
    {successMessage}
  </div>
)}
       <div className="no-print">
  <button className="pdf-btn" onClick={downloadPDF}>
    Download PDF
  </button>
</div>
      </div>
    </div>
  );
}