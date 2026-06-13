"use client";

import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import AddExpenseModal from "../components/addExpenseModal/addExpenseModal.js";
import SetIncomeModal from "../components/setIncomeModal/setIncomeModal.js";
import EditExpenseModal from "../components/editExpenseModal/editExpenseModal.js";
import "./expenses.scss";
import { Pencil, Trash } from "lucide-react";

// Category badge colors — matches the dashboard cards
const CATEGORY_STYLES = {
  savings:   { background: "rgba(132,150,124,0.12)", color: "#4a6644" },
  transport: { background: "rgba(218,95,80,0.10)",   color: "#993c1d" },
  data:      { background: "rgba(55,138,221,0.10)",  color: "#185fa5" },
  work:      { background: "rgba(127,119,221,0.10)", color: "#3c3489" },
  tech:      { background: "rgba(239,159,39,0.10)",  color: "#633806" },
};

function ExpensesPage() {
  const { expenses, deleteExpense, totalSpent } = useExpenses();

  // Modal visibility states
  const [addOpen,    setAddOpen]    = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);

  // Edit modal — holds the expense being edited (null = closed)
  const [editTarget, setEditTarget] = useState(null);

  // Format number → "15,000"
  const fmt = (n) => n.toLocaleString("en-NG");

  // Biggest single expense — used in the summary stat card
  const biggest = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;

  return (
    <section className="page expenses-page">

      {/* ── Nav ── */}
      <nav>
        <h2>Expenses</h2>
        <div className="nav-actions">
          <button className="income-btn"      onClick={() => setIncomeOpen(true)}>Set Income</button>
          <button className="add-expense-btn" onClick={() => setAddOpen(true)}>+ Add Expense</button>
        </div>
      </nav>

      {/* ── Summary stat cards ── */}
      <div className="stats-row">

        {/* Total amount spent across all expenses */}
        <div className="stat-card">
          <p className="stat-label">Total Expenses</p>
          <p className="stat-value">₦{fmt(totalSpent)}</p>
        </div>

        {/* Count of expense entries */}
        <div className="stat-card">
          <p className="stat-label">No. of Entries</p>
          <p className="stat-value">{expenses.length}</p>
        </div>

        {/* Highest single expense */}
        <div className="stat-card">
          <p className="stat-label">Biggest Expense</p>
          <p className="stat-value danger">₦{fmt(biggest)}</p>
        </div>

      </div>

      {/* ── Expenses table ── */}
      <div className="table-card">

        {expenses.length === 0 ? (
          // Empty state — shown before any expenses are added
          <div className="empty-state">
            <p>No expenses yet.</p>
            <button className="add-expense-btn" onClick={() => setAddOpen(true)}>
              + Add your first expense
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="expenses-table">

              {/* Column headers */}
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* One row per expense — newest first */}
                {[...expenses].reverse().map((item) => {
                  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.savings;
                  return (
                    <tr key={item.id}>

                      {/* Name */}
                      <td className="expense-name">{item.name}</td>

                      {/* Category pill */}
                      <td>
                        <span
                          className="category-badge"
                          style={{ background: style.background, color: style.color }}
                        >
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="expense-date">{item.date}</td>

                      {/* Amount */}
                      <td className="expense-amount">-₦{fmt(item.amount)}</td>

                      {/* Edit + Delete actions */}
                      <td className="actions">
                        {/* Edit — opens modal pre-filled with this expense */}
                        <button
                          className="action-btn edit"
                          onClick={() => setEditTarget(item)}
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil width={15} height={15}/>
                          <i className="ti ti-edit" aria-hidden="true" />
                        </button>

                        {/* Delete — removes from context immediately */}
                        <button
                          className="action-btn delete"
                          onClick={() => deleteExpense(item.id)}
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash width={15} height={15}/>
                          <i className="ti ti-trash" aria-hidden="true" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </div>

      {/* ── Modals ── */}
      <AddExpenseModal isOpen={addOpen}         onClose={() => setAddOpen(false)} />
      <SetIncomeModal  isOpen={incomeOpen}       onClose={() => setIncomeOpen(false)} />
      <EditExpenseModal expense={editTarget}     onClose={() => setEditTarget(null)} />

    </section>
  );
}

export default ExpensesPage;