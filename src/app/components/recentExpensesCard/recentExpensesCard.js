"use client";

import React from 'react';
import { useExpenses } from "../../context/ExpenseContext";
import "./recentExpensesCard.scss";

// Category icon + className — className drives the color in SCSS
const CATEGORY_META = {
  savings:   { icon: "ti-piggy-bank",    className: "savings"   },
  transport: { icon: "ti-car",           className: "transport" },
  data:      { icon: "ti-wifi",          className: "data"      },
  work:      { icon: "ti-file-text",     className: "work"      },
  tech:      { icon: "ti-device-laptop", className: "tech"      },
};

const FALLBACK = { icon: "ti-receipt", className: "savings" };

function RecentExpensesCard() {
  const { expenses, totalSpent } = useExpenses();

  // 4 most recent — reversed so newest is at the top
  const recent = expenses.slice(-4).reverse();
  const fmt    = (n) => n.toLocaleString("en-NG");

  return (
    <div className="recent-expenses-card card card3">

      {/* Header */}
      <div className="card-header">
        <h3>Recent Expenses</h3>
      </div>

      {/* Expense rows */}
      <div className="expenses-list">
        {recent.length === 0 ? (
          <p className="empty-state">No expenses yet. Add one to get started.</p>
        ) : (
          recent.map((item) => {
            const meta = CATEGORY_META[item.category] || FALLBACK;
            return (
              <div className="recent-expense-row" key={item.id}>

                <div className={`expense-icon ${meta.className}`}>
                  <i className={`ti ${meta.icon}`} aria-hidden="true" />
                </div>

                {/* Name stacked above date */}
                <div className="expense-details">
                  <p className="expense-name">{item.name}</p>
                  <p className="expense-date">{item.date}</p>
                </div>

                <span className="expense-amount">-₦{fmt(item.amount)}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className="footer-label">Total spent</span>
        <span className="footer-total">-₦{fmt(totalSpent)}</span>
      </div>

    </div>
  );
}

export default RecentExpensesCard;