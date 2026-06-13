"use client";

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useExpenses } from "../../context/ExpenseContext";
import "./expensesAnalysis.scss";

Chart.register(...registerables);

// The fixed category order for the x axis
const CATEGORIES = ['savings', 'transport', 'data', 'work', 'tech'];
const LABELS     = ['Savings', 'Transport', 'Data', 'Work', 'Tech'];

function ExpenseAnalysisCard() {
  const { spendingByCategory, totalSpent } = useExpenses();
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Map each category to its spent amount (0 if nothing spent yet)
    const data = CATEGORIES.map((cat) => spendingByCategory[cat] || 0);

    // Gradient fill — dark near the line, fades to transparent at the bottom
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0,   'rgba(142,72,205,0.35)');
    gradient.addColorStop(0.6, 'rgba(132,150,124,0.08)');
    gradient.addColorStop(1,   'rgba(132,150,124,0)');

    // Destroy previous chart instance before creating a new one
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: LABELS,
        datasets: [{
          data,
          borderColor: '#8e48cd',
          borderWidth: 2.5,
          fill: true,
          backgroundColor: gradient,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: '#8e48cd',
          pointBorderColor: '#1a1a1a',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2c2c2c',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: 'rgba(255,255,255,0.5)',
            bodyColor: '#fff',
            padding: 10,
            callbacks: {
              label: ctx => ` ₦${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid:   { color: 'rgba(255,255,255,0.04)' },
            ticks:  { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              callback: v => '₦' + (v >= 1000 ? v / 1000 + 'k' : v),
            },
            border: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();

  // Re-draw the chart whenever spending data changes
  }, [spendingByCategory]);

  const fmt = (n) => n.toLocaleString("en-NG");

  return (
    <div className="expense-analysis-card card card2">

      {/* Header */}
      <div className="card-header">
        <div className="header-left">
          <p className="label">Spending by category</p>
          {/* Total updates live as expenses are added */}
          <p className="total">₦{fmt(totalSpent)}</p>
        </div>
      </div>

      {/* Chart — re-renders when spendingByCategory changes */}
      <div className="chart-area">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Line chart showing spending amount per category"
        >
          Spending breakdown by category.
        </canvas>
      </div>

    </div>
  );
}

export default ExpenseAnalysisCard;