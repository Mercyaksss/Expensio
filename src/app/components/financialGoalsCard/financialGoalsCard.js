"use client";

import { useExpenses } from "../../context/ExpenseContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./financialGoalsCard.scss";

const TARGET = 150000;

function FinancialGoalsCard() {
  const { spendingByCategory } = useExpenses();

  const saved     = spendingByCategory["savings"] || 0;
  const remaining = Math.max(TARGET - saved, 0);
  const percent   = Math.min(Math.round((saved / TARGET) * 100), 100);
  const fmt       = (n) => n.toLocaleString("en-NG");

  const chartData = [
    { name: "Saved",     value: saved     },
    { name: "Remaining", value: remaining },
  ];

  return (
    <div className="financial-goals-card card">

      <div className="goals-header">
        <h3>Savings Goal</h3>
        <span className="goal-label">New Laptop</span>
      </div>

      <div className="gauge-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={65}
              outerRadius={95}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="var(--accent)" />
              <Cell fill="rgba(255,255,255,0.08)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="gauge-center">
          <p className="gauge-percent">{percent}%</p>
          <p className="gauge-sublabel">of goal</p>
        </div>
      </div>

      <div className="goal-stats">
        <div className="goal-stat">
          <p className="stat-label">Saved</p>
          <p className="stat-value saved">₦{fmt(saved)}</p>
        </div>
        <div className="goal-stat">
          <p className="stat-label">Target</p>
          <p className="stat-value">₦{fmt(TARGET)}</p>
        </div>
        <div className="goal-stat">
          <p className="stat-label">Remaining</p>
          <p className="stat-value remaining">₦{fmt(remaining)}</p>
        </div>
      </div>

    </div>
  );
}

export default FinancialGoalsCard;