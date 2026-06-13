"use client";

import { useExpenses } from "../../context/ExpenseContext";
import { TrendingUp } from "lucide-react";
import "./totalIncome.scss";

function TotalIncome() {
  const { income } = useExpenses();

  // Format with commas e.g. 500000 → "500,000"
  const fmt = (n) => Number(n).toLocaleString("en-NG");

  return (
    <div className="total-income card kpi">

      {/* Icon + label row */}
      <div className="kpi-top">
        <div className="kpi-icon">
          <TrendingUp size={22} color="#fff" />
        </div>
        <span className="kpi-label">Income</span>
      </div>

      {/* <div className="kpi-bottom"> */}
        <p className="kpi-amount">₦{fmt(income)}</p>
        {/* Subtle bottom tag */}
        <p className="kpi-sub">Monthly</p>
      {/* </div> */}
    </div>
  );
}

export default TotalIncome;