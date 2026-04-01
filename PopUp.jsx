import React from "react";
import "../styles/PopUp.css";

export default function PopUp({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>⚠️ Confirm Delete</h2>
        <p>{message}</p>

        <div style={{ marginTop: "15px" }}>
          <button className="delete" onClick={onConfirm}>
            Yes, Delete
          </button>

          <button className="addBtn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}