"use client";

import { useExpenses } from "../../context/ExpenseContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./financialGoalsCard.scss";

function FinancialGoalsCard() {
  const { spendingByCategory, goal } = useExpenses();

  const target = goal?.target || 0;
  const label   = goal?.label  || "No goal set";

  const saved     = spendingByCategory["savings"] || 0;
  const remaining = Math.max(target - saved, 0);

  // Avoid divide-by-zero when no target has been set yet
  const percent = target > 0
    ? Math.min(Math.round((saved / target) * 100), 100)
    : 0;

  const fmt = (n) => n.toLocaleString("en-NG");

  const chartData = [
    { name: "Saved",     value: saved     },
    { name: "Remaining", value: remaining || 1 }, // keep a sliver visible even at 0 target
  ];

  return (
    <div className="financial-goals-card card">

      <div className="goals-header">
        <h3>Savings Goal</h3>
        <span className="goal-label">{label}</span>
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
              innerRadius={55}
              outerRadius={90}
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
          <p className="stat-value">₦{fmt(target)}</p>
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