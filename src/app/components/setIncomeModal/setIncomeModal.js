"use client";

import React, { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import "./setIncomeModal.scss";

function SetIncomeModal({ isOpen, onClose }) {
  const { income, updateIncome } = useExpenses();

  // Pre-fill with current income if already set
  const [value, setValue] = useState(income || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!value || parseFloat(value) <= 0) {
      setError("Please enter a valid income amount.");
      return;
    }
    updateIncome(value);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <h2>Set Income</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            Enter your monthly income. Your available balance will be calculated from this.
          </p>

          {/* Income amount */}
          <div className="field">
            <label htmlFor="income">Monthly Income (₦)</label>
            <input
              id="income"
              type="number"
              placeholder="e.g. 500000"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="submit-btn" onClick={handleSubmit}>
            Save Income
          </button>
        </div>

      </div>
    </div>
  );
}

export default SetIncomeModal;