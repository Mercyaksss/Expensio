"use client";

import "./expensesAnalysis.scss";
import { useExpenses } from "../../context/ExpenseContext";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";

// The fixed category order for the X axis — matches the rest of the app
const CATEGORIES = ["savings", "transport", "data", "work", "tech"];
const LABELS      = ["Savings", "Transport", "Data", "Work", "Tech"];

function ExpensesAnalysis() {
  const { spendingByCategory, totalSpent } = useExpenses();

  // Build a flat array recharts can consume:
  // [{ category: "Savings", amount: 15000 }, ...]
  // If a category has no spending yet it defaults to 0
  const data = CATEGORIES.map((cat, i) => ({
    category: LABELS[i],
    amount:   spendingByCategory[cat] || 0,
  }));

  // Format a number for the Y axis e.g. 15000 → "₦15k"
  const fmtAxis = (n) => (n >= 1000 ? `₦${n / 1000}k` : `₦${n}`);

  return (
    <div className="expense-analysis-card card">

      {/* Card header */}
      <div className="analysis-header">
        <div>
          <p className="analysis-label">Spending by category</p>
          <p className="analysis-total">₦{totalSpent.toLocaleString("en-NG")}</p>
        </div>
      </div>

      {/* Chart — ResponsiveContainer fills the remaining card height */}
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>

            {/* Gradient fill — purple at top, fades out */}
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="75%"  stopColor="var(--accent)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0}    />
              </linearGradient>
            </defs>

            {/* Faint horizontal grid lines only */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
            />

            {/* X axis — category names */}
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            />

            {/* Y axis — amounts formatted as ₦15k */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={fmtAxis}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              width={48}
            />

            {/* Custom dark tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* The area line + fill */}
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--accent)"
              strokeWidth={1}
              fill="url(#spendGradient)"
            //   dot={{ r: 4, fill: "var(-)", strokeWidth: 2, stroke: "var(--card-background)" }}
              activeDot={{ r: 6, fill: "var(--accent)", stroke: "var(--background)", strokeWidth: 2 }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// Custom tooltip — shown when hovering a data point
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="analysis-tooltip">
      <p className="tooltip-label">{label}</p>
      <p className="tooltip-value">
        ₦{payload[0].value.toLocaleString("en-NG")}
      </p>
    </div>
  );
}

export default ExpensesAnalysis;