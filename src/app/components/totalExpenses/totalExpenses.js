"use client";

import { useExpenses } from "../../context/ExpenseContext";
import { ReceiptIcon } from "lucide-react";
import "./totalExpenses.scss";

function TotalExpenses() {
  const { totalSpent } = useExpenses();
  const fmt = (n) => Number(n).toLocaleString("en-NG");

  return (
    <div className="total-expenses card kpi">

      <div className="kpi-top">
        <div className="kpi-icon">
          <ReceiptIcon size={22} color="#fff" />
        </div>
        <span className="kpi-label">Expenses</span>
      </div>

      <p className="kpi-amount">₦{fmt(totalSpent)}</p>

      <p className="kpi-sub">Total spent</p>

    </div>
  );
}

export default TotalExpenses;