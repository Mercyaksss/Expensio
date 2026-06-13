"use client";

import React, { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import "./addExpenseModal.scss";

// Categories match the icon/color keys used in the other cards
const CATEGORIES = [
  { value: "savings",   label: "Savings"   },
  { value: "transport", label: "Transport" },
  { value: "data",      label: "Data"      },
  { value: "work",      label: "Work"      },
  { value: "tech",      label: "Tech"      },
];

// Blank form state — reused on open and after submit
const EMPTY_FORM = {
  name:     "",
  category: "",
  amount:   "",
  date:     "",
};

function AddExpenseModal({ isOpen, onClose }) {
  const { addExpense } = useExpenses();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  // Update a single field in the form state
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error on any change
  };

  // Validate, call addExpense, then close
  const handleSubmit = () => {
    // Basic validation — all fields required
    if (!form.name || !form.category || !form.amount || !form.date) {
      setError("Please fill in all fields.");
      return;
    }

    // Format the date into a readable string e.g. "Jun 11, 2026"
    const formatted = new Date(form.date).toLocaleDateString("en-US", {
      month: "short",
      day:   "numeric",
      year:  "numeric",
    });

    // Push to context — amount stored as a number, not a string
    addExpense({
      name:     form.name.trim(),
      category: form.category,
      amount:   parseFloat(form.amount),
      date:     formatted,
    });

    // Reset form and close modal
    setForm(EMPTY_FORM);
    onClose();
  };

  // Close when clicking the dark overlay behind the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  return (
    // Dark overlay — clicking it closes the modal
    <div className="modal-overlay" onClick={handleOverlayClick}>

      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <h2>Add Expense</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Form fields */}
        <div className="modal-body">

          {/* Expense name */}
          <div className="field">
            <label htmlFor="name">Expense name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Data Subscription"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Category dropdown */}
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Amount + Date side by side */}
          <div className="field-row">
            <div className="field">
              <label htmlFor="amount">Amount (₦)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Inline validation error */}
          {error && <p className="form-error">{error}</p>}

          {/* Submit */}
          <button className="submit-btn" onClick={handleSubmit}>
            Add Expense
          </button>

        </div>
      </div>
    </div>
  );
}

export default AddExpenseModal;