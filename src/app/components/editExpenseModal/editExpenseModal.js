"use client";

import React, { useState, useEffect } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import "./editExpenseModal.scss";

// Same category list as AddExpenseModal
const CATEGORIES = [
  { value: "savings",   label: "Savings"   },
  { value: "transport", label: "Transport" },
  { value: "data",      label: "Data"      },
  { value: "work",      label: "Work"      },
  { value: "tech",      label: "Tech"      },
];

function EditExpenseModal({ expense, onClose }) {
  const { expenses, deleteExpense, addExpense } = useExpenses();

  const [form, setForm] = useState({ name: "", category: "", amount: "", date: "" });
  const [error, setError] = useState("");

  // Pre-fill the form whenever a different expense is passed in
  useEffect(() => {
    if (expense) {
      // Convert the display date back to yyyy-mm-dd for the date input
      const raw = new Date(expense.date);
      const yyyy = raw.getFullYear();
      const mm   = String(raw.getMonth() + 1).padStart(2, "0");
      const dd   = String(raw.getDate()).padStart(2, "0");

      setForm({
        name:     expense.name,
        category: expense.category,
        amount:   expense.amount,
        date:     `${yyyy}-${mm}-${dd}`,
      });
      setError("");
    }
  }, [expense]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.amount || !form.date) {
      setError("Please fill in all fields.");
      return;
    }

    // Format date for display
    const formatted = new Date(form.date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

    // Strategy: delete the old entry, add the updated one
    // This keeps the context logic simple — no need for an editExpense() function
    deleteExpense(expense.id);
    addExpense({
      name:     form.name.trim(),
      category: form.category,
      amount:   parseFloat(form.amount),
      date:     formatted,
    });

    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // expense being null means the modal is closed
  if (!expense) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <h2>Edit Expense</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">

          {/* Expense name */}
          <div className="field">
            <label htmlFor="edit-name">Expense name</label>
            <input
              id="edit-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="field">
            <label htmlFor="edit-category">Category</label>
            <select id="edit-category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Amount + Date */}
          <div className="field-row">
            <div className="field">
              <label htmlFor="edit-amount">Amount (₦)</label>
              <input
                id="edit-amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="edit-date">Date</label>
              <input
                id="edit-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="submit-btn" onClick={handleSubmit}>Save Changes</button>

        </div>
      </div>
    </div>
  );
}

export default EditExpenseModal;